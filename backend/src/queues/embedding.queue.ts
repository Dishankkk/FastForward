import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis';

export const EMBEDDING_QUEUE_NAME = 'embedding-generation';

export interface EmbeddingJobData {
  videoId: string;
}

export const embeddingQueue = new Queue(EMBEDDING_QUEUE_NAME, {
  connection: redisConnection as any,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: { age: 3600 },
    removeOnFail: { age: 86400 },
  },
});

export async function queueEmbeddingJob(videoId: string) {
  await embeddingQueue.add('generate-embeddings', { videoId });
}