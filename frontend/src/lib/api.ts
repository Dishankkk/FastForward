const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function uploadVideo(file: File): Promise<{ videoId: string }> {
  const formData = new FormData();
  formData.append('video', file);

  const res = await fetch(`${API_BASE}/api/videos/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json();
  return { videoId: data.videoId };
}

export async function getVideo(videoId: string) {
  const res = await fetch(`${API_BASE}/api/videos/${videoId}`);
  if (!res.ok) throw new Error('Failed to fetch video');
  return res.json();
}

export async function searchVideo(videoId: string, query: string) {
  const res = await fetch(`${API_BASE}/api/videos/${videoId}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error('Search failed');
  const data = await res.json();
  return data.results;
}