import { Job } from 'bullmq';
import { VideoModel } from '../../models/video.model';
import { TranscriptModel } from '../../models/transcript.model';
import { TranscriptChunkModel } from '../../models/transcript-chunk.model';
import { generateEmbeddings } from '../../services/embeddings.service'; 
import { EmbeddingJobData } from '../../queues/embedding.queue';
import { queueChapteringJob } from '../../queues/chaptering.queue';

export async function processEmbeddingJob(job: Job<EmbeddingJobData>) {
  const { videoId } = job.data;

  const video = await VideoModel.findById(videoId);
  if (!video) throw new Error(`Video ${videoId} not found`);

  const transcript = await TranscriptModel.findOne({ video: video._id });
  if (!transcript) throw new Error(`Transcript for video ${videoId} not found`);

  video.status = 'generating_embeddings';
  await video.save();

  const texts = transcript.segments.map((seg) => seg.text);
  
  // Uses the plural batch mapping service safely
  const embeddings = await generateEmbeddings(texts);

  const chunkDocs = transcript.segments.map((seg, i) => ({
    video: video._id,
    text: seg.text,
    start: seg.start,
    end: seg.end,
    embedding: embeddings[i],
  }));

  await TranscriptChunkModel.insertMany(chunkDocs);

  video.status = 'embedded';
  await video.save();
  
  // Clean pass-off to the chaptering queue stage
  await queueChapteringJob(videoId);
}