import type { Chapter } from '../lib/types';

interface ChapterListProps {
  chapters: Chapter[];
  onSelectTime: (time: number) => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function ChapterList({ chapters, onSelectTime }: ChapterListProps) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold text-white">Chapters</h2>
      {chapters.map((chapter, i) => (
        <button
          key={i}
          onClick={() => onSelectTime(chapter.startTime)}
          className="text-left rounded-md p-3 bg-neutral-800 hover:bg-neutral-700 transition-colors"
        >
          <div className="flex justify-between items-baseline">
            <span className="font-medium text-white">{chapter.title}</span>
            <span className="text-sm text-neutral-400">{formatTime(chapter.startTime)}</span>
          </div>
          <p className="text-sm text-neutral-400 mt-1">{chapter.summary}</p>
        </button>
      ))}
    </div>
  );
}