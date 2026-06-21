import { Worker } from 'bullmq';
import { redisConnection } from '../config/redis';
import { CHAPTERING_QUEUE_NAME } from '../queues/chaptering.queue';
import { processChapteringJob } from './processors/chaptering.processor';

export function createChapteringWorker(): Worker {
  const worker = new Worker(CHAPTERING_QUEUE_NAME, processChapteringJob, {
    connection: redisConnection as any,
    concurrency: 3, 
    lockDuration: 300000,       // Gives Groq ample time to stream back long chapter JSON blocks
    stalledInterval: 300000,    
    maxStalledCount: 1,         
  });

  worker.on('completed', (job) => {
    console.log(`[worker] chapters generated for video ${job.data.videoId}`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[worker] chaptering job ${job?.id} failed: ${err.message}`);
  });

  return worker;
}