import { useRef, useState } from 'react';
import { uploadVideo } from './lib/api';
import { useVideoStatus } from './hooks/useVideoStatus';
import { VideoPlayer, type VideoPlayerHandle } from './components/VideoPlayer';
import { ChapterList } from './components/ChapterList';
import { SearchPanel } from './components/SearchPanel';
import { About } from './components/About';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'app' | 'about'>('app');
  const [videoId, setVideoId] = useState<string | null>(null);
  const playerRef = useRef<VideoPlayerHandle>(null);

  const { video, isProcessing, error } = useVideoStatus(videoId);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const { videoId } = await uploadVideo(file);
    setVideoId(videoId);
    setCurrentTab('app'); // Ensure we are on the app tab when uploading
  }

  function handleSelectTime(time: number) {
    playerRef.current?.seekTo(time);
  }

  return (
    <div className="min-h-screen relative selection:bg-blue-500/30">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Navbar with Tabs */}
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => setCurrentTab('app')}
            className="font-bold text-xl tracking-tight flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs text-white">FF</div>
            <span className="text-white">FastForward</span>
          </button>
          
          <div className="flex gap-1 bg-[#111] p-1 rounded-lg border border-white/10">
            <button 
              onClick={() => setCurrentTab('app')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${currentTab === 'app' ? 'bg-white/10 text-white shadow' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
            >
              Processor
            </button>
            <button 
              onClick={() => setCurrentTab('about')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${currentTab === 'about' ? 'bg-white/10 text-white shadow' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
            >
              Architecture
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Router */}
      {currentTab === 'about' ? (
        <About />
      ) : (
        <main className="max-w-7xl mx-auto px-6 py-12 relative z-10 animate-in fade-in duration-300">
          
          {/* HERO SECTION (Only visible before upload) */}
          {!videoId && (
            <div className="flex flex-col items-center text-center mt-12 mb-24">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent">
                Video intelligence,<br />instantly accessible.
              </h1>
              <p className="text-lg text-neutral-400 max-w-2xl mb-10">
                Upload any lecture, meeting, or long-form video. FastForward uses AI to extract context, generate smart chapters, and let you search exact moments in seconds.
              </p>
              
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                <label className="relative flex items-center justify-center gap-2 bg-white text-black font-medium px-8 py-4 rounded-lg cursor-pointer hover:bg-neutral-200 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                  Select Video to Process
                  <input type="file" accept="video/mp4" onChange={handleFileSelect} className="hidden" />
                </label>
              </div>
            </div>
          )}

          {/* PROCESSING STATE */}
          {videoId && isProcessing && (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-16 h-16 border-4 border-white/10 border-t-blue-500 rounded-full animate-spin mb-6"></div>
              <h2 className="text-2xl font-semibold mb-2 text-white">Processing Pipeline Active</h2>
              <p className="text-neutral-400 flex items-center gap-2">
                Current step: <span className="text-blue-400 font-mono bg-blue-500/10 px-2 py-1 rounded">{video?.status ?? 'initializing'}</span>
              </p>
            </div>
          )}

          {/* ERROR STATE */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center max-w-lg mx-auto mt-12">
              <h3 className="text-red-400 font-semibold text-lg mb-1">Pipeline Failed</h3>
              <p className="text-neutral-400 text-sm">{error}</p>
            </div>
          )}

          {/* APPLICATION UI (Visible when ready) */}
          {video && video.status === 'ready' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                  <VideoPlayer ref={playerRef} src={video.videoUrl} />
                </div>
              </div>
              <div className="flex flex-col gap-6 h-[600px]">
                <div className="bg-[#111] border border-white/10 rounded-xl p-5 flex-shrink-0">
                  <SearchPanel videoId={video._id} onSelectTime={handleSelectTime} />
                </div>
                <div className="bg-[#111] border border-white/10 rounded-xl p-5 flex-1 overflow-y-auto">
                  <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">Smart Chapters</h3>
                  <ChapterList chapters={video.chapters} onSelectTime={handleSelectTime} />
                </div>
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
}