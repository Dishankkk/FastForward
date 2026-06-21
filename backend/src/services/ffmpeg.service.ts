import ffmpeg from 'fluent-ffmpeg';
// @ts-ignore
import * as ffmpegInstallerPath from '@ffmpeg-installer/ffmpeg';

// Point fluent-ffmpeg at the static binary instead of relying
// on a system-level ffmpeg install. This makes the project
// portable across dev machines, CI, and production containers.
ffmpeg.setFfmpegPath(ffmpegInstallerPath.path);

/**
 * Extracts the audio track from a video file and encodes it as a
 * heavily compressed MP3, optimized for speech recognition rather
 * than music fidelity.
 *
 * Why these specific settings:
 * - audioChannels(1): mono. Whisper doesn't benefit from stereo
 *   separation for speech, and mono halves the data immediately.
 * - audioFrequency(16000): 16kHz is the sample rate Whisper's
 *   underlying model was trained on. Higher rates add file size
 *   with no transcription benefit; lower rates start to clip
 *   speech frequencies and hurt accuracy.
 * - audioBitrate('64k'): plenty for clear speech, nowhere near
 *   what's needed for music — this is where most of the size
 *   reduction comes from.
 */
export function extractAudio(
  inputVideoPath: string,
  outputAudioPath: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    ffmpeg(inputVideoPath)
      .noVideo()
      .audioCodec('libmp3lame')
      .audioChannels(1)
      .audioFrequency(16000)
      .audioBitrate('64k')
      .on('error', (err) => {
        reject(new Error(`ffmpeg audio extraction failed: ${err.message}`));
      })
      .on('end', () => {
        resolve(outputAudioPath);
      })
      .save(outputAudioPath);
  });
}