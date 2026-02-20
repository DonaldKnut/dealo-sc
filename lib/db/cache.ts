import { LRUCache } from "lru-cache";

/**
 * Query result caching utility
 * Uses LRU cache for in-memory caching
 * For production, consider using Redis
 */

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  max?: number; // Maximum number of entries
}

// Create separate caches for different data types
const queryCaches = new Map<string, LRUCache<string, any>>();

/**
 * Get or create a cache instance
 */
function getCache(name: string, options: CacheOptions = {}): LRUCache<string, any> {
  if (!queryCaches.has(name)) {
    const cache = new LRUCache<string, any>({
      max: options.max || 500,
      ttl: options.ttl || 60 * 1000, // Default 1 minute
    });
    queryCaches.set(name, cache);
  }
  return queryCaches.get(name)!;
}

/**
 * Generate cache key from query parameters
 */
function generateCacheKey(prefix: string, params: Record<string, any>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}:${JSON.stringify(params[key])}`)
    .join("|");
  return `${prefix}:${sortedParams}`;
}

/**
 * Cache a query result
 */
export async function cacheQuery<T>(
  cacheName: string,
  key: string | Record<string, any>,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  const cache = getCache(cacheName, options);
  const cacheKey = typeof key === "string" ? key : generateCacheKey(cacheName, key);

  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached !== undefined) {
    return cached as T;
  }

  // Fetch and cache
  const result = await fetcher();
  cache.set(cacheKey, result);
  return result;
}

/**
 * Invalidate cache entries
 */
export function invalidateCache(cacheName: string, pattern?: string): void {
  const cache = getCache(cacheName);
  
  if (pattern) {
    // Invalidate entries matching pattern
    for (const key of Array.from(cache.keys())) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  } else {
    // Clear entire cache
    cache.clear();
  }
}

/**
 * Pre-configured caches for common use cases
 */
export const caches = {
  // User queries - 5 minute TTL
  users: (key: string | Record<string, any>, fetcher: () => Promise<any>) =>
    cacheQuery("users", key, fetcher, { ttl: 5 * 60 * 1000, max: 200 }),

  // Course queries - 2 minute TTL
  courses: (key: string | Record<string, any>, fetcher: () => Promise<any>) =>
    cacheQuery("courses", key, fetcher, { ttl: 2 * 60 * 1000, max: 500 }),

  // Work queries - 2 minute TTL
  works: (key: string | Record<string, any>, fetcher: () => Promise<any>) =>
    cacheQuery("works", key, fetcher, { ttl: 2 * 60 * 1000, max: 500 }),

  // Job queries - 1 minute TTL
  jobs: (key: string | Record<string, any>, fetcher: () => Promise<any>) =>
    cacheQuery("jobs", key, fetcher, { ttl: 60 * 1000, max: 300 }),

  // Message queries - 30 second TTL (more dynamic)
  messages: (key: string | Record<string, any>, fetcher: () => Promise<any>) =>
    cacheQuery("messages", key, fetcher, { ttl: 30 * 1000, max: 200 }),

  // Dashboard queries - 1 minute TTL
  dashboard: (key: string | Record<string, any>, fetcher: () => Promise<any>) =>
    cacheQuery("dashboard", key, fetcher, { ttl: 60 * 1000, max: 100 }),
};

/**
 * Helper to wrap a query function with caching
 */
export function withCache<T extends (...args: any[]) => Promise<any>>(
  cacheFn: (key: string | Record<string, any>, fetcher: () => Promise<any>) => Promise<any>,
  queryFn: T,
  keyGenerator?: (...args: Parameters<T>) => string | Record<string, any>
): T {
  return (async (...args: Parameters<T>) => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
    return cacheFn(key, () => queryFn(...args));
  }) as T;
}



