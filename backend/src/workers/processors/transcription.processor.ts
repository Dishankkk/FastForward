import { Job } from 'bullmq';
import { VideoModel } from '../../models/video.model';
import { TranscriptModel } from '../../models/transcript.model';
import { transcribeAudio } from '../../services/ai.service';
import { TranscriptionJobData } from '../../queues/transcription.queue';
import { queueEmbeddingJob } from '../../queues/embedding.queue'; 

export async function processTranscriptionJob(job: Job<TranscriptionJobData>) {
  const { videoId, audioPath } = job.data;

  const video = await VideoModel.findById(videoId);
  if (!video) {
    throw new Error(`Video ${videoId} not found`);
  }

  video.status = 'transcribing';
  await video.save();

  try {
    const result = await transcribeAudio(audioPath);

    await TranscriptModel.create({
      video: video._id,
      fullText: result.text,
      segments: result.segments,
      words: result.words,
    });

    video.status = 'transcribed';
    await video.save();

    // The baton is passed cleanly to the embedding layer only.
    // The embedding processor will handle kicking off the chaptering later!
    await queueEmbeddingJob(videoId);
    
  } catch (error: any) {
    video.status = 'failed';
    await video.save();
    throw new Error(`Transcription stage failed: ${error.message}`);
  }
}