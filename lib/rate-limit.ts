/**
 * In-memory rate limiting for API routes
 * Note: For production, use Redis or a dedicated rate limiting service
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

/**
 * Cleans up expired entries every 5 minutes
 */
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 5 * 60 * 1000);

/**
 * Checks if a request should be rate limited
 * @param identifier - Unique identifier (email, IP, etc.)
 * @param maxRequests - Maximum requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns true if request should be allowed, false if rate limited
 */
export function checkRateLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = identifier.toLowerCase();

  if (!store[key] || store[key].resetTime < now) {
    // Create new entry or reset expired entry
    store[key] = {
      count: 1,
      resetTime: now + windowMs,
    };
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: now + windowMs,
    };
  }

  if (store[key].count >= maxRequests) {
    // Rate limited
    return {
      allowed: false,
      remaining: 0,
      resetTime: store[key].resetTime,
    };
  }

  // Increment counter
  store[key].count += 1;
  return {
    allowed: true,
    remaining: maxRequests - store[key].count,
    resetTime: store[key].resetTime,
  };
}

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(
  remaining: number,
  resetTime: number
): Record<string, string> {
  return {
    "X-RateLimit-Remaining": remaining.toString(),
    "X-RateLimit-Reset": Math.ceil(resetTime / 1000).toString(),
  };
}


