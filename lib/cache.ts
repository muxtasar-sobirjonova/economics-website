import { Redis } from "@upstash/redis";
import { logger } from "./logger";

const isUpstashConfigured = 
  !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

const redis = isUpstashConfigured ? Redis.fromEnv() : null;

// Fallback in-memory cache if Redis is not configured
const memoryCache = new Map<string, { value: unknown, expiry: number }>();

export const CacheService = {
  async get<T>(key: string): Promise<T | null> {
    if (redis) {
      try {
        const data = await redis.get<T>(key);
        return data;
      } catch (err) {
        logger.warn(`Redis GET failed for key: ${key}`, err);
      }
    }

    // Fallback to memory
    const entry = memoryCache.get(key);
    if (!entry) return null;
    
    if (Date.now() > entry.expiry) {
      memoryCache.delete(key);
      return null;
    }
    
    return entry.value as T;
  },

  async set(key: string, value: unknown, ttlSeconds: number = 3600): Promise<void> {
    if (redis) {
      try {
        await redis.set(key, value, { ex: ttlSeconds });
        return;
      } catch (err) {
        logger.warn(`Redis SET failed for key: ${key}`, err);
      }
    }

    // Fallback to memory
    memoryCache.set(key, {
      value,
      expiry: Date.now() + (ttlSeconds * 1000)
    });
  },

  async delete(key: string): Promise<void> {
    if (redis) {
      try {
        await redis.del(key);
        return;
      } catch (err) {
        logger.warn(`Redis DEL failed for key: ${key}`, err);
      }
    }

    // Fallback to memory
    memoryCache.delete(key);
  },
  
  async deletePattern(pattern: string): Promise<void> {
    if (redis) {
      try {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
          await redis.del(...keys);
        }
        return;
      } catch (err) {
        logger.warn(`Redis keys pattern DEL failed: ${pattern}`, err);
      }
    }

    // Fallback to memory (simple substring match for simple patterns)
    const normalizedPattern = pattern.replace(/\*/g, '');
    for (const key of Array.from(memoryCache.keys())) {
      if (key.includes(normalizedPattern)) {
        memoryCache.delete(key);
      }
    }
  }
};
