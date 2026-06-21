import { Request, Response } from 'express';
import path from 'path';
import { VideoModel } from '../../models/video.model';
import { queueAudioExtractionJob } from '../../queues/video-processing.queue';
import { TranscriptModel } from '../../models/transcript.model';
import { searchVideoTranscript } from '../../services/search.service'; 

/**
 * Fetches the raw full transcript and timestamped segments for a video
 */
export async function handleGetTranscript(req: Request, res: Response) {
  const transcript = await TranscriptModel.findOne({ video: req.params.id });
  if (!transcript) {
    return res.status(404).json({ error: 'Transcript not available yet' });
  }
  return res.status(200).json(transcript);
}

/**
 * Handles initial file multipart upload and triggers asynchronous queue pipeline
 */
export async function handleVideoUpload(req: Request, res: Response) {
  if (!req.file) {
    return res.status(400).json({ error: 'No video file provided' });
  }

  // Create the video entry in MongoDB
  const video = await VideoModel.create({
    originalFilename: req.file.originalname,
    videoPath: req.file.path,
    status: 'queued',
  });

  // Mongoose documents automatically map the ObjectId to a string via the '.id' getter.
  const videoId = video.id;

  // We only await the near-instant write into Redis queue
  await queueAudioExtractionJob(videoId);

  // 202 Accepted is the ideal HTTP code for deferred async processing
  return res.status(202).json({
    videoId: videoId,
    status: video.status,
  });
}

/**
 * Polls the current state-machine status string of a processing video
 */
export async function handleGetVideoStatus(req: Request, res: Response) {
  const video = await VideoModel.findById(req.params.id);
  
  if (!video) {
    return res.status(404).json({ error: 'Video not found' });
  }

  return res.status(200).json({
    videoId: video.id,
    status: video.status,
  });
}

/**
 * Performs local text embedding generation on the user query string
 * and executes a $vectorSearch aggregation stage against MongoDB Atlas.
 */
export async function handleSearchVideo(req: Request, res: Response) {
  const { query } = req.body;
  
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'A "query" string is required' });
  }

  try {
    const results = await searchVideoTranscript(req.params.id, query);
    return res.status(200).json({ results });
  } catch (error: any) {
    console.error(`[search-controller] Error executing vector search: ${error.message}`);
    return res.status(500).json({ 
      error: 'Failed to process vector query request', 
      details: error.message 
    });
  }
}

/**
 * Fetches the core metadata payload and AI-generated chapters array for a specific video
 * Appends a accessible stream URL for the frontend HTML5 video player elements
 */
export async function handleGetVideo(req: Request, res: Response) {
  try {
    const video = await VideoModel.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Extracts the filename (e.g., "77a2eaec-....mp4") from the absolute system storage path
    const videoFilename = path.basename(video.videoPath);
    
    // Builds a public network URI: e.g., http://localhost:4000/media/videos/filename.mp4
    const videoUrl = `${req.protocol}://${req.get('host')}/media/videos/${videoFilename}`;

    return res.status(200).json({
      ...video.toObject(),
      videoUrl,
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch video details', details: error.message });
  }
}