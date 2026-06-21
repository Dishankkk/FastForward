import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis';

// 1. Define the name string FIRST so it is in scope
export const VIDEO_PROCESSING_QUEUE_NAME = 'video-processing';

export interface AudioExtractionJobData {
  videoId: string;
}

// 2. Now initialize the Queue using the defined name variable
export const videoProcessingQueue = new Queue(VIDEO_PROCESSING_QUEUE_NAME, {
  connection: redisConnection as any, 
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: { age: 3600 },
    removeOnFail: { age: 86400 },
  },
});

export async function queueAudioExtractionJob(videoId: string) {
  await videoProcessingQueue.add('extract-audio', { videoId } as AudioExtractionJobData);
}