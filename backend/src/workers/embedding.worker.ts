import { Worker } from 'bullmq';
import { redisConnection } from '../config/redis';
import { EMBEDDING_QUEUE_NAME } from '../queues/embedding.queue';
import { processEmbeddingJob } from './processors/embedding.processor';

export function createEmbeddingWorker(): Worker {
  const worker = new Worker(EMBEDDING_QUEUE_NAME, processEmbeddingJob, {
    connection: redisConnection as any,
    concurrency: 1,             // Kept at 1 to manage local CPU machine learning load
    lockDuration: 300000,       // Protects lock status if transformers.js blocks the thread
    stalledInterval: 300000,    
    maxStalledCount: 1,         
  });

  worker.on('completed', (job) => {
    console.log(`[worker] embeddings completed for video ${job.data.videoId}`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[worker] embedding job ${job?.id} failed: ${err.message}`);
  });

  return worker;
}