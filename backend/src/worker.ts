import dotenv from 'dotenv';
dotenv.config();

import { connectToDatabase } from './config/db';
import { createAudioExtractionWorker } from './workers/audio-extraction.worker';
import { createTranscriptionWorker } from './workers/transcription.worker';
import { createEmbeddingWorker } from './workers/embedding.worker'; // 👈 Fixed path: just a single dot!
import { createChapteringWorker } from './workers/chaptering.worker';

async function bootstrap() {
  await connectToDatabase();

  const audioWorker = createAudioExtractionWorker();
  const transcriptionWorker = createTranscriptionWorker();
  const embeddingWorker = createEmbeddingWorker(); // 👈 Initialized smoothly
  const chapteringWorker = createChapteringWorker();

  console.log('[worker] listening on audio-extraction, transcription, and embedding queues');

  process.on('SIGTERM', async () => {
    console.log('[worker] shutting down gracefully...');
    await Promise.all([
       audioWorker.close(),
    transcriptionWorker.close(),
    embeddingWorker.close(),
    chapteringWorker.close(),
    ]);
    process.exit(0);
  });
}

bootstrap();