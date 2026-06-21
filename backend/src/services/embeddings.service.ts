import { pipeline, FeatureExtractionPipeline } from '@xenova/transformers';

let embedder: FeatureExtractionPipeline | null = null;

/**
 * Lazily loads the embedding model on first call, then reuses it.git add backend/src/services/embeddings.service.ts
 */
async function getEmbedder(): Promise<FeatureExtractionPipeline> {
  if (!embedder) {
    console.log('[embeddings] loading space-efficient all-MiniLM-L6-v2 model...');
    
    embedder = (await pipeline(
      'feature-extraction', 
      'Xenova/all-MiniLM-L6-v2',
      { 
        quantized: true 
      }
    )) as FeatureExtractionPipeline;
    
    console.log('[embeddings] model loaded and cached safely in memory');
  }
  return embedder;
}

/**
 * Converts a text string into a 384-dimensional embedding vector.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const embed = await getEmbedder();
  
  const sanitizedText = text.replace(/\s+/g, ' ').trim();
  if (!sanitizedText) return new Array(EMBEDDING_DIMENSIONS).fill(0);

  const output = await embed(sanitizedText, { pooling: 'mean', normalize: true });
  
  return Array.from(output.data as Float32Array);
}

/**
 * Processes arrays sequentially rather than concurrently.
 * This ensures your RAM usage stays completely flat and level!
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const results: number[][] = [];
  
  console.log(`[embeddings] systematically processing ${texts.length} chunks sequentially...`);
  
  for (let i = 0; i < texts.length; i++) {
    const embedding = await generateEmbedding(texts[i]);
    results.push(embedding);
  }
  
  console.log(`[embeddings] successfully calculated all ${texts.length} vectors!`);
  return results;
}

export const EMBEDDING_DIMENSIONS = 384;