import { useEffect, useState, useRef } from 'react';
import { getVideo } from '../lib/api';
import type { Video } from '../lib/types';

const TERMINAL_STATES = new Set(['ready', 'failed']);
const POLL_INTERVAL_MS = 3000;

export function useVideoStatus(videoId: string | null) {
  const [video, setVideo] = useState<Video | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Keep the ref type as unknown to satisfy the strict linter rules
  const intervalRef = useRef<unknown>(null);

  useEffect(() => {
    if (!videoId) return;

    let cancelled = false;

    async function poll() {
      try {
        const data = await getVideo(videoId!);
        if (cancelled) return;
        setVideo(data);

        // Cast unknown through a double-assertion directly to a number
        if (TERMINAL_STATES.has(data.status) && intervalRef.current) {
          clearInterval(intervalRef.current as unknown as number);
        }
      } catch (err) {
        if (!cancelled) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to fetch video status';
          setError(errorMessage);
        }
      }
    }

    poll(); 
    
    intervalRef.current = setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      if (intervalRef.current) {
        clearInterval(intervalRef.current as unknown as number);
      }
    };
  }, [videoId]);

  const isProcessing = video ? !TERMINAL_STATES.has(video.status) : false;

  return { video, isProcessing, error };
}