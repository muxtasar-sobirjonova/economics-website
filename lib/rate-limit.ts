import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a new ratelimiter, that allows 10 requests per 10 seconds
export const rateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export async function checkRateLimit(ip: string = "anonymous") {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const { success, limit, reset, remaining } = await rateLimit.limit(ip);
    if (!success) {
      throw new Error("Rate limit exceeded");
    }
    return { success, limit, reset, remaining };
  }
  
  // Stub for development when Redis is not configured
  return { success: true, limit: 10, reset: 0, remaining: 10 };
}
