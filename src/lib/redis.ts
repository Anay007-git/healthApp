import { Redis } from '@upstash/redis';

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

export const isRedisConfigured = !!(redisUrl && redisToken);

export const redis = isRedisConfigured
  ? new Redis({
      url: redisUrl!,
      token: redisToken!,
    })
  : null;

if (!isRedisConfigured) {
  console.log('⚠️ Upstash Redis credentials missing. Caching will run in-memory/be bypassed.');
}

// Simple in-memory fallback cache for development/review environments
const localInMemoryCache = new Map<string, { value: any; expiry: number }>();

export async function cacheGet<T>(key: string): Promise<T | null> {
  if (redis) {
    try {
      const data = await redis.get(key);
      if (!data) return null;
      // Upstash Redis automatically handles JSON parsing or returns object depending on client,
      // but let's parse it safely just in case.
      return (typeof data === 'string' ? JSON.parse(data) : data) as T;
    } catch (e) {
      console.warn('Redis GET failure, bypassing cache:', e);
    }
  }

  // Fallback to local memory cache
  const cached = localInMemoryCache.get(key);
  if (cached) {
    if (Date.now() < cached.expiry) {
      return cached.value as T;
    }
    localInMemoryCache.delete(key);
  }
  return null;
}

export async function cacheSet<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
  if (redis) {
    try {
      const stringified = JSON.stringify(value);
      await redis.set(key, stringified, { ex: ttlSeconds });
      return;
    } catch (e) {
      console.warn('Redis SET failure, bypassing cache:', e);
    }
  }

  // Fallback to local memory cache
  localInMemoryCache.set(key, {
    value,
    expiry: Date.now() + ttlSeconds * 1000
  });
}
