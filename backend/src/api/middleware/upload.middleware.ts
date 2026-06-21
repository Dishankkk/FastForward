import multer, { Options } from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { getVideoUploadDir } from '../../services/storage.service';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, getVideoUploadDir());
  },
  filename: (_req, file, cb) => {
    const uniqueId = uuidv4();
    const ext = path.extname(file.originalname).toLowerCase(); // Normalize extension casing
    cb(null, `${uniqueId}${ext}`);
  },
});

// Robust file filter to prevent curl or alternative OS encoders from tripping validation
const fileFilter: Options['fileFilter'] = (_req, file, cb) => {
  // 1. Expand standard allowed MIME type variations
  const allowedMimeTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-m4v'];
  
  // 2. Add an extension fallback check (crucial for raw windows streams/curl guesses)
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = ['.mp4', '.m4v', '.mov'];

  if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    // Reject file with a clear diagnostic message
    cb(new Error('Only .mp4 video files are supported') as any, false);
  }
};

export const uploadVideoMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB
  },
}).single('video');