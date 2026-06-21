import { Schema, model, Document, Types } from 'mongoose';

export interface TranscriptChunkDocument extends Document {
  video: Types.ObjectId;
  text: string;
  start: number;
  end: number;
  embedding: number[];
}

const transcriptChunkSchema = new Schema<TranscriptChunkDocument>({
  video: { type: Schema.Types.ObjectId, ref: 'Video', required: true, index: true },
  text: { type: String, required: true },
  start: { type: Number, required: true },
  end: { type: Number, required: true },
  embedding: { type: [Number], required: true },
});

export const TranscriptChunkModel = model<TranscriptChunkDocument>(
  'TranscriptChunk',
  transcriptChunkSchema
);