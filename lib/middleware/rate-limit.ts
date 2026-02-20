import { LRUCache } from "lru-cache";
import { NextRequest, NextResponse } from "next/server";

interface RateLimitOptions {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval: number; // Max unique tokens to track
  maxRequests: number; // Max requests per interval
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

// Create separate caches for different rate limit configurations
const rateLimitCaches = new Map<string, LRUCache<string, number>>();

/**
 * Get or create a rate limit cache
 */
function getRateLimitCache(options: RateLimitOptions): LRUCache<string, number> {
  const cacheKey = `${options.interval}-${options.maxRequests}`;
  
  if (!rateLimitCaches.has(cacheKey)) {
    const cache = new LRUCache<string, number>({
      max: options.uniqueTokenPerInterval || 500,
      ttl: options.interval,
      updateAgeOnGet: false,
    });
    rateLimitCaches.set(cacheKey, cache);
  }
  
  return rateLimitCaches.get(cacheKey)!;
}

/**
 * Check rate limit for a given identifier
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions
): RateLimitResult {
  const cache = getRateLimitCache(options);
  const key = identifier.toLowerCase();
  const now = Date.now();
  
  const currentCount = cache.get(key) || 0;
  
  if (currentCount >= options.maxRequests) {
    // Rate limited - get TTL to calculate reset time
    const entry = cache.peek(key);
    const resetTime = entry ? now + (cache.getRemainingTTL(key) || options.interval) : now + options.interval;
    
    return {
      allowed: false,
      remaining: 0,
      resetTime,
    };
  }
  
  // Increment counter
  cache.set(key, currentCount + 1);
  
  return {
    allowed: true,
    remaining: options.maxRequests - (currentCount + 1),
    resetTime: now + options.interval,
  };
}

/**
 * Get client identifier from request (IP address or user ID)
 */
export function getClientIdentifier(req: NextRequest, userId?: string): string {
  // Prefer user ID if available (more accurate for authenticated users)
  if (userId) {
    return `user:${userId}`;
  }
  
  // Fall back to IP address
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0] || realIp || "unknown";
  
  return `ip:${ip}`;
}

/**
 * Rate limit middleware factory
 */
export function createRateLimiter(options: RateLimitOptions) {
  return async (req: NextRequest, userId?: string): Promise<RateLimitResult> => {
    const identifier = getClientIdentifier(req, userId);
    return checkRateLimit(identifier, options);
  };
}

/**
 * Common rate limit configurations
 */
export const rateLimiters = {
  // Strict: 5 requests per minute
  strict: createRateLimiter({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 500,
    maxRequests: 5,
  }),
  
  // Standard: 20 requests per minute
  standard: createRateLimiter({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 500,
    maxRequests: 20,
  }),
  
  // Moderate: 60 requests per minute
  moderate: createRateLimiter({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 500,
    maxRequests: 60,
  }),
  
  // Generous: 100 requests per minute
  generous: createRateLimiter({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 500,
    maxRequests: 100,
  }),
  
  // Upload: 10 requests per hour
  upload: createRateLimiter({
    interval: 60 * 60 * 1000, // 1 hour
    uniqueTokenPerInterval: 200,
    maxRequests: 10,
  }),
  
  // Auth: 5 requests per 15 minutes
  auth: createRateLimiter({
    interval: 15 * 60 * 1000, // 15 minutes
    uniqueTokenPerInterval: 1000,
    maxRequests: 5,
  }),
};

/**
 * Wrapper for API route handlers with rate limiting
 */
export function withRateLimit<T = any>(
  rateLimiter: (req: NextRequest, userId?: string) => Promise<RateLimitResult>,
  handler: (req: NextRequest, ...args: any[]) => Promise<T>
) {
  return async (req: NextRequest, ...args: any[]): Promise<NextResponse<T | { error: string; retryAfter?: number }>> => {
    try {
      // Try to get user ID from session for better rate limiting
      let userId: string | undefined;
      try {
        const { getServerSession } = await import("next-auth");
        const { authOptions } = await import("@/authOptions/authOptions");
        const session = await getServerSession(authOptions);
        userId = session?.user?.id;
      } catch {
        // Ignore auth errors for rate limiting
      }
      
      const rateLimitResult = await rateLimiter(req, userId);
      
      if (!rateLimitResult.allowed) {
        return NextResponse.json(
          {
            error: "Too many requests. Please try again later.",
            retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
          },
          {
            status: 429,
            headers: {
              "X-RateLimit-Limit": "rate-limit-exceeded",
              "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
              "X-RateLimit-Reset": Math.ceil(rateLimitResult.resetTime / 1000).toString(),
              "Retry-After": Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
            },
          }
        );
      }
      
      const result = await handler(req, ...args);
      const response = NextResponse.json(result);
      
      // Add rate limit headers
      response.headers.set("X-RateLimit-Remaining", rateLimitResult.remaining.toString());
      response.headers.set("X-RateLimit-Reset", Math.ceil(rateLimitResult.resetTime / 1000).toString());
      
      return response;
    } catch (error: any) {
      console.error("Rate limit middleware error:", error);
      return NextResponse.json(
        { error: "Internal server error", retryAfter: 0 },
        { status: 500 }
      );
    }
  };
}



