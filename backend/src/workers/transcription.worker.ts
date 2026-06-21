import { Worker } from 'bullmq';
import { redisConnection } from '../config/redis';
import { TRANSCRIPTION_QUEUE_NAME } from '../queues/transcription.queue';
import { processTranscriptionJob } from './processors/transcription.processor';

export function createTranscriptionWorker(): Worker {
  const worker = new Worker(TRANSCRIPTION_QUEUE_NAME, processTranscriptionJob, {
    connection: redisConnection as any,
    concurrency: 3,
    lockDuration: 300000,       // 5 minutes safety cushion while waiting on Groq API
    stalledInterval: 300000,    
    maxStalledCount: 1,         
  });

  worker.on('completed', (job) => {
    console.log(`[worker] transcription completed for video ${job.data.videoId}`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[worker] transcription job ${job?.id} failed: ${err.message}`);
  });

  return worker;
}