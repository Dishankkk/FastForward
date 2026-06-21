import { Job } from 'bullmq';
import { VideoModel } from '../../models/video.model';
import { extractAudio } from '../../services/ffmpeg.service';
import { getAudioOutputPath } from '../../services/storage.service';
import { AudioExtractionJobData } from '../../queues/video-processing.queue';
import { queueTranscriptionJob } from '../../queues/transcription.queue';


export async function processAudioExtractionJob(job: Job<AudioExtractionJobData>) {
  const { videoId } = job.data;

  const video = await VideoModel.findById(videoId);
  if (!video) {
    // Throwing here marks the BullMQ job as failed and triggers
    // the retry/backoff policy configured on the queue.
    throw new Error(`Video ${videoId} not found`);
  }

  video.status = 'extracting_audio';
  await video.save();

  const audioOutputPath = getAudioOutputPath(video.id);
  await extractAudio(video.videoPath, audioOutputPath);

  video.audioPath = audioOutputPath;
  video.status = 'audio_ready';
  await video.save();

  await queueTranscriptionJob(video.id, audioOutputPath);

  // Forward-looking note for Milestone 4: once transcription exists,
  // this is where we'd enqueue the *next* stage job — chaining the
  // pipeline as a sequence of small jobs rather than one giant function.
}