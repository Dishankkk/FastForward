import { forwardRef, useImperativeHandle, useRef } from 'react';

export interface VideoPlayerHandle {
  seekTo: (timeInSeconds: number) => void;
}

interface VideoPlayerProps {
  src: string;
}

// forwardRef + useImperativeHandle is the React-sanctioned escape hatch
// for exactly this situation: a child component wrapping a native DOM
// element that has its own imperative API (play, pause, currentTime).
// We expose ONLY seekTo — not the raw DOM node — so callers can't
// accidentally reach in and mutate things we don't want them touching.
export const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(
  ({ src }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useImperativeHandle(ref, () => ({
      seekTo: (timeInSeconds: number) => {
        if (videoRef.current) {
          videoRef.current.currentTime = timeInSeconds;
          videoRef.current.play();
        }
      },
    }));

    return (
      <video
        ref={videoRef}
        src={src}
        controls
        className="w-full rounded-lg bg-black aspect-video"
      />
    );
  }
);
VideoPlayer.displayName = 'VideoPlayer';