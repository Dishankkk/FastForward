import { pipeline, FeatureExtractionPipeline } from '@xenova/transformers';

// 1. Update the singleton type to use FeatureExtractionPipeline
let embedder: FeatureExtractionPipeline | null = null;

/**
 * Lazily loads the embedding model on first call, then reuses it.
 */
async function getEmbedder(): Promise<FeatureExtractionPipeline> {
  if (!embedder) {
    console.log('[embeddings] loading all-MiniLM-L6-v2 model...');
    // Typecast the returned factory promise wrapper to match our type variable
    embedder = (await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')) as FeatureExtractionPipeline;
    console.log('[embeddings] model loaded and cached in memory');
  }
  return embedder;
}

/**
 * Converts a text string into a 384-dimensional embedding vector.
 * Returns a plain number[] ready to store in MongoDB.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const embed = await getEmbedder();
  
  // mean_pooling=true averages the token embeddings into one
  // sentence-level vector — standard practice for sentence similarity.
  const output = await embed(text, { pooling: 'mean', normalize: true });
  
  return Array.from(output.data as Float32Array);
}


export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  return Promise.all(texts.map(generateEmbedding));
}

// Export the embedding dimensions as a constant so the Mongoose schema
// and the MongoDB vector index definition stay in sync automatically.
export const EMBEDDING_DIMENSIONS = 384;