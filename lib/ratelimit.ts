import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const isUpstashConfigured = 
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

// Create a new ratelimiter, that allows 10 requests per 10 seconds
export const ratelimit = isUpstashConfigured
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, "10 s"),
      analytics: true,
    })
  : {
      limit: async () => ({ success: true, limit: 10, remaining: 9, reset: Date.now() }),
    } as unknown as Ratelimit;
