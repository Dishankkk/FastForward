import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis';

export const TRANSCRIPTION_QUEUE_NAME = 'transcription';

export interface TranscriptionJobData {
  videoId: string;
  audioPath: string;
}

export const transcriptionQueue = new Queue(TRANSCRIPTION_QUEUE_NAME, {
  connection: redisConnection as any,
  defaultJobOptions: {
    attempts: 3,
    // Longer backoff than the ffmpeg queue — OpenAI rate limit
    // resets are measured in tens of seconds, not milliseconds.
    backoff: { type: 'exponential', delay: 10000 },
    removeOnComplete: { age: 3600 },
    removeOnFail: { age: 86400 },
  },
});

export async function queueTranscriptionJob(videoId: string, audioPath: string) {
  await transcriptionQueue.add('transcribe', { videoId, audioPath } as TranscriptionJobData);
}