import { Job } from 'bullmq';
import { VideoModel } from '../../models/video.model';
import { TranscriptModel } from '../../models/transcript.model';
import { generateChapters } from '../../services/chaptering.service';
import { ChapteringJobData } from '../../queues/chaptering.queue';

export async function processChapteringJob(job: Job<ChapteringJobData>) {
  const { videoId } = job.data;

  const video = await VideoModel.findById(videoId);
  if (!video) throw new Error(`Video ${videoId} not found`);

  const transcript = await TranscriptModel.findOne({ video: video._id });
  if (!transcript) throw new Error(`Transcript for video ${videoId} not found`);

  video.status = 'generating_chapters';
  await video.save();

  const chapters = await generateChapters(transcript.segments);

  video.chapters = chapters;
  video.status = 'ready'; // ← final pipeline state
  await video.save();
}