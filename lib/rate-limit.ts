import { Redis } from "@upstash/redis";

const isUpstashConfigured = 
  !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

const redis = isUpstashConfigured ? Redis.fromEnv() : null;
const rateLimiters = new Map<string, { count: number; resetTime: number }>();

export async function rateLimit(key: string, options: { interval: number; limit: number }) {
  if (redis) {
    try {
      const now = Date.now();
      const redisKey = `ratelimit:${key}`;
      
      const pipeline = redis.pipeline();
      pipeline.get(redisKey);
      pipeline.ttl(redisKey);
      const results = await pipeline.exec();
      const currentStr = results[0] as string | null;
      const ttl = results[1] as number;
      
      const current = currentStr ? parseInt(currentStr, 10) : 0;
      
      if (current >= options.limit) {
        return {
          success: false,
          limit: options.limit,
          remaining: 0,
          reset: now + (ttl > 0 ? ttl * 1000 : options.interval),
        };
      }
      
      const nextCount = current + 1;
      const expireSeconds = ttl > 0 ? ttl : Math.ceil(options.interval / 1000);
      
      await redis.set(redisKey, String(nextCount), { ex: expireSeconds });
      
      return {
        success: true,
        limit: options.limit,
        remaining: options.limit - nextCount,
        reset: now + (expireSeconds * 1000),
      };
    } catch (e) {
      console.warn("[RateLimit] Redis failed, falling back to memory:", e);
    }
  }

  const now = Date.now();
  const entry = rateLimiters.get(key);

  // Periodic cleanup to avoid memory leaks
  if (rateLimiters.size > 5000) {
    rateLimiters.forEach((v, k) => {
      if (now > v.resetTime) {
        rateLimiters.delete(k);
      }
    });
  }

  if (!entry || now > entry.resetTime) {
    const newEntry = {
      count: 1,
      resetTime: now + options.interval,
    };
    rateLimiters.set(key, newEntry);
    return {
      success: true,
      limit: options.limit,
      remaining: options.limit - 1,
      reset: newEntry.resetTime,
    };
  }

  if (entry.count >= options.limit) {
    return {
      success: false,
      limit: options.limit,
      remaining: 0,
      reset: entry.resetTime,
    };
  }

  entry.count += 1;
  return {
    success: true,
    limit: options.limit,
    remaining: options.limit - entry.count,
    reset: entry.resetTime,
  };
}
