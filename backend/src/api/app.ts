import express, { Express } from 'express';
import cors from 'cors';
import videoRoutes from './routes/video.routes';
import { ensureStorageDirsExist } from '../services/storage.service';
import { getVideoUploadDir } from '../services/storage.service';


export function createApp(): Express {
  ensureStorageDirsExist();
  

  const app = express();
  app.use(cors());
  app.use(express.json());
 app.use('/media/videos', express.static(getVideoUploadDir()));
  app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));
  app.use('/api/videos', videoRoutes);

  return app;
}