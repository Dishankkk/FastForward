import IORedis from 'ioredis';

// BullMQ requires maxRetriesPerRequest set to null. Without this,
// ioredis applies its own default retry ceiling and will throw
// "Reached the max retries per request limit" during any brief
// Redis hiccup — BullMQ needs to own that retry behavior itself.
export const redisConnection = new IORedis(
  process.env.REDIS_URL || 'redis://localhost:6379',
  { maxRetriesPerRequest: null }
);