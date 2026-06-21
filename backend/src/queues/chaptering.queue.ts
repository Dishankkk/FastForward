import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis';

export const CHAPTERING_QUEUE_NAME = 'chaptering';

export interface ChapteringJobData {
  videoId: string;
}

export const chapteringQueue = new Queue(CHAPTERING_QUEUE_NAME, {
  connection: redisConnection as any, // 👈 Added "as any" type casting here
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 8000 },
    removeOnComplete: { age: 3600 },
    removeOnFail: { age: 86400 },
  },
});

export async function queueChapteringJob(videoId: string) {
  await chapteringQueue.add('generate-chapters', { videoId } as ChapteringJobData);
}