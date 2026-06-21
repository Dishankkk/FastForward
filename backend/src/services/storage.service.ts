import path from 'path';
import fs from 'fs';

// Centralizing these paths means the rest of the app never
// hardcodes a directory string. If we move to S3 later, this
// is the only file that needs to change.
const VIDEO_DIR = path.join(__dirname, '../../uploads/videos');
const AUDIO_DIR = path.join(__dirname, '../../uploads/audio');

export function ensureStorageDirsExist(): void {
  [VIDEO_DIR, AUDIO_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

export function getVideoUploadDir(): string {
  return VIDEO_DIR;
}

export function getAudioOutputPath(videoId: string): string {
  // .mp3 extension matches the codec we encode to in ffmpeg.service.ts
  return path.join(AUDIO_DIR, `${videoId}.mp3`);
}