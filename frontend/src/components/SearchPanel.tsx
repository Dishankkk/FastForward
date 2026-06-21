import { useState } from 'react';
import { searchVideo } from '../lib/api';
import type { SearchResult } from '../lib/types';

interface SearchPanelProps {
  videoId: string;
  onSelectTime: (time: number) => void;
}

export function SearchPanel({ videoId, onSelectTime }: SearchPanelProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const data = await searchVideo(videoId, query);
      setResults(data);
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about anything said in the video..."
          className="flex-1 rounded-md bg-neutral-800 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isSearching}
          className="rounded-md bg-blue-600 hover:bg-blue-500 px-4 py-2 text-white font-medium disabled:opacity-50"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </form>

      <div className="flex flex-col gap-2">
        {results.map((result, i) => (
          <button
            key={i}
            onClick={() => onSelectTime(result.start)}
            className="text-left rounded-md p-3 bg-neutral-800 hover:bg-neutral-700 transition-colors"
          >
            <p className="text-white text-sm">{result.text}</p>
            <span className="text-xs text-neutral-400">
              {Math.floor(result.start)}s · {Math.round(result.score * 100)}% match
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}