import { Worker } from 'bullmq';
import { redisConnection } from '../config/redis';
import { VIDEO_PROCESSING_QUEUE_NAME } from '../queues/video-processing.queue';
import { processAudioExtractionJob } from './processors/audio-extraction.processor';

export function createAudioExtractionWorker(): Worker {
  const worker = new Worker(
    VIDEO_PROCESSING_QUEUE_NAME,
    processAudioExtractionJob,
    {
      connection: redisConnection as any,
      concurrency: 2,           // how many jobs THIS worker process runs in parallel
      lockDuration: 300000,     // 5 minutes safety cushion
      stalledInterval: 300000,  // Only check for stalls every 5 minutes
      maxStalledCount: 1,       // Prevent duplicate task loop re-entry
    }
  );

  worker.on('completed', (job) => {
    console.log(`[worker] completed job ${job.id} for video ${job.data.videoId}`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[worker] job ${job?.id} failed: ${err.message}`);
  });

  return worker;
}