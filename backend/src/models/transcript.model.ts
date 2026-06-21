import { Schema, model, Document, Types } from 'mongoose';

interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
}

interface TranscriptWord {
  word: string;
  start: number;
  end: number;
}

export interface TranscriptDocument extends Document {
  video: Types.ObjectId;
  fullText: string;
  segments: TranscriptSegment[];
  words: TranscriptWord[];
  createdAt: Date;
}

const transcriptSchema = new Schema<TranscriptDocument>({
  video: { type: Schema.Types.ObjectId, ref: 'Video', required: true, index: true },
  fullText: { type: String, required: true },
  segments: [{ start: Number, end: Number, text: String }],
  words: [{ word: String, start: Number, end: Number }],
  createdAt: { type: Date, default: Date.now },
});

export const TranscriptModel = model<TranscriptDocument>('Transcript', transcriptSchema);