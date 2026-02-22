import Redis from 'ioredis'

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined
}

export const redis = globalForRedis.redis ?? new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000)
    return delay
  },
})

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis

// Cache utilities
export async function getCached<T>(key: string): Promise<T | null> {
  try {
    const cached = await redis.get(key)
    return cached ? JSON.parse(cached) : null
  } catch (error) {
    console.error('Redis get error:', error)
    return null
  }
}

export async function setCache(key: string, value: any, ttl: number = 3600): Promise<void> {
  try {
    await redis.setex(key, ttl, JSON.stringify(value))
  } catch (error) {
    console.error('Redis set error:', error)
  }
}

export async function deleteCache(key: string): Promise<void> {
  try {
    await redis.del(key)
  } catch (error) {
    console.error('Redis delete error:', error)
  }
}

export async function publishNotification(notification: any): Promise<void> {
  try {
    await redis.publish('notifications', JSON.stringify(notification))
  } catch (error) {
    console.error('Redis publish error:', error)
  }
}

// Rate limiting
export async function checkRateLimit(
  identifier: string,
  limit: number = 10,
  window: number = 60
): Promise<{ allowed: boolean; remaining: number }> {
  try {
    const key = `ratelimit:${identifier}`
    const current = await redis.incr(key)
    
    if (current === 1) {
      await redis.expire(key, window)
    }
    
    const remaining = Math.max(0, limit - current)
    
    return {
      allowed: current <= limit,
      remaining,
    }
  } catch (error) {
    console.error('Rate limit error:', error)
    return { allowed: true, remaining: limit }
  }
}
