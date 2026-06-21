import mongoose, { Schema } from 'mongoose';

// 1. Synchronized all pipeline status states, including chapter generation stages
export type VideoStatus = 
  | 'uploaded' 
  | 'queued' 
  | 'extracting_audio' 
  | 'audio_ready' 
  | 'transcribing'
  | 'transcribed' 
  | 'generating_embeddings'
  | 'embedded'
  | 'generating_chapters' // 👈 Added for AI summary generation stage
  | 'ready'               // 👈 Added as the final state-machine completion target
  | 'failed';

// 2. Strongly typed subdocument shape for AI-extracted timeline milestones
interface ChapterSubdoc {
  title: string;
  summary: string;
  startTime: number;
  endTime: number;
}

export interface IVideo extends mongoose.Document {
  originalFilename: string;
  videoPath: string;
  status: VideoStatus;
  audioPath?: string;
  chapters: ChapterSubdoc[]; // 👈 Added to interface
  createdAt: Date;
}

const VideoSchema = new Schema<IVideo>({
  originalFilename: { type: String, required: true },
  videoPath: { type: String, required: true },
  status: { 
    type: String, 
    // Exact match with your complete TypeScript state-machine configuration
    enum: [
      'uploaded', 'queued', 'extracting_audio', 'audio_ready', 
      'transcribing', 'transcribed', 'generating_embeddings', 'embedded',
      'generating_chapters', 'ready', 'failed'
    ], 
    default: 'uploaded',
    required: true 
  },
  audioPath: { type: String },
  // 3. Storing an array of objects inside our parent document for high-performance retrieval
  chapters: [{
    title: { type: String, required: true },
    summary: { type: String, required: true },
    startTime: { type: Number, required: true },
    endTime: { type: Number, required: true }
  }],
  createdAt: { type: Date, default: Date.now }
});

export const VideoModel = mongoose.model<IVideo>('Video', VideoSchema);