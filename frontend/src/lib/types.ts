export type VideoStatus =
  | 'uploaded' | 'queued' | 'extracting_audio' | 'audio_ready'
  | 'transcribing' | 'transcribed' | 'generating_embeddings' | 'embedded'
  | 'generating_chapters' | 'ready' | 'failed';

export interface Chapter {
  title: string;
  summary: string;
  startTime: number;
  endTime: number;
}

export interface Video {
  _id: string;
  originalFilename: string;
  status: VideoStatus;
  chapters: Chapter[];
  videoUrl: string;
}

export interface SearchResult {
  text: string;
  start: number;
  end: number;
  score: number;
}