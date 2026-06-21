import { Router } from 'express';
import { uploadVideoMiddleware } from '../middleware/upload.middleware';
import { 
  handleVideoUpload, 
  handleGetVideoStatus, 
  handleGetTranscript,
  handleSearchVideo,
  handleGetVideo // 👈 Added this to your imports list
} from '../controllers/video.controller';

const router = Router();

// 1. Accepts the file binary, enqueues the heavy job, and returns HTTP 202
router.post('/upload', uploadVideoMiddleware, handleVideoUpload);

// 2. Polls the current state machine string ('uploaded' -> 'queued' -> etc.)
router.get('/:id/status', handleGetVideoStatus);

// 3. Fetches the final database documents once the background transcription finishes
router.get('/:id/transcript', handleGetTranscript);

// 4. Performs semantic vector queries inside a specific video context
router.post('/:id/search', handleSearchVideo);

// 5. Fetches the metadata summary payload along with full AI chapter segmentation
router.get('/:id', handleGetVideo);

export default router;