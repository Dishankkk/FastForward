import mongoose from 'mongoose';
import { TranscriptChunkModel } from '../models/transcript-chunk.model';
import { generateEmbedding } from './embeddings.service';

export interface SearchResult {
  text: string;
  start: number;
  end: number;
  score: number;
}

export async function searchVideoTranscript(
  videoId: string,
  query: string,
  limit = 5
): Promise<SearchResult[]> {
  // Embed the user's typed question with the SAME model used for the
  // chunks — query and document embeddings must live in the same
  // vector space for cosine similarity to mean anything.
  const queryEmbedding = await generateEmbedding(query);

  const results = await TranscriptChunkModel.aggregate([
    {
      $vectorSearch: {
        index: 'transcript_vector_index',
        path: 'embedding',
        queryVector: queryEmbedding,
        // numCandidates should be meaningfully larger than limit —
        // it's the size of the approximate-nearest-neighbor candidate
        // pool the algorithm considers before returning the top `limit`.
        numCandidates: 100,
        limit,
        filter: { video: new mongoose.Types.ObjectId(videoId) },
      },
    },
    {
      $project: {
        _id: 0,
        text: 1,
        start: 1,
        end: 1,
        // vectorSearchScore is a normalized similarity score Atlas
        // computes for you — higher means more relevant.
        score: { $meta: 'vectorSearchScore' },
      },
    },
  ]);

  return results as SearchResult[];
}