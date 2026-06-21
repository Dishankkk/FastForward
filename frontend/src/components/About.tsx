export function About() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-6 animate-in fade-in duration-700">
      
      {/* Header Section */}
      <div className="text-center mb-20 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-purple-600/20 blur-[100px] rounded-full pointer-events-none" />
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white relative z-10">
          The Architecture Behind <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">FastForward</span>
        </h1>
        <p className="text-xl text-neutral-400 max-w-3xl mx-auto relative z-10">
          Built to turn opaque video files into fully searchable, intelligent documents using a decoupled, zero-cost AI background pipeline.
        </p>
      </div>

      {/* Performance Metrics Grid */}
      <h2 className="text-2xl font-semibold text-white mb-6">Pipeline Performance</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <div className="bg-gradient-to-br from-[#111] to-[#1a1a1a] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-24 h-24 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="text-blue-400 text-5xl font-bold mb-2">95%</div>
          <div className="text-white font-medium mb-1">Payload Reduction</div>
          <div className="text-neutral-400 text-sm">Stripping video frames via ffmpeg before sending to Whisper bypasses API limits and accelerates transfer times.</div>
        </div>

        <div className="bg-gradient-to-br from-[#111] to-[#1a1a1a] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-24 h-24 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91 2.34.59 4.22 1.63 4.22 3.82-.01 2.05-1.52 3.01-3.16 3.25z" />
            </svg>
          </div>
          <div className="text-emerald-400 text-5xl font-bold mb-2">$0.00</div>
          <div className="text-white font-medium mb-1">Zero-Cost AI Inference</div>
          <div className="text-neutral-400 text-sm">Running @xenova/transformers locally in Node.js and utilizing Groq's Llama 3.3 70B eliminates API embedding costs.</div>
        </div>

        <div className="bg-gradient-to-br from-[#111] to-[#1a1a1a] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-24 h-24 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
            </svg>
          </div>
          <div className="text-purple-400 text-5xl font-bold mb-2">&lt; 1s</div>
          <div className="text-white font-medium mb-1">Vector Search Latency</div>
          <div className="text-neutral-400 text-sm">Atlas Vector Search instantly maps user queries to the exact millisecond a topic was spoken via cosine similarity.</div>
        </div>
      </div>

      {/* The Tech Stack Grid */}
      <h2 className="text-2xl font-semibold text-white mb-6">The Zero-Cost Stack</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
        {[
          { name: 'React + TypeScript', role: 'Frontend & Imperative Video UI', color: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/5' },
          { name: 'Node + Express', role: 'Async API & Processing', color: 'text-green-400', border: 'border-green-500/20', bg: 'bg-green-500/5' },
          { name: 'Redis + BullMQ', role: 'Job Queue & Horizontal Scaling', color: 'text-red-400', border: 'border-red-500/20', bg: 'bg-red-500/5' },
          { name: 'MongoDB Atlas', role: 'Vector Store & Persistence', color: 'text-emerald-500', border: 'border-emerald-500/20', bg: 'bg-emerald-500/5' },
          { name: 'Groq Whisper', role: 'High-Speed Audio Transcription', color: 'text-orange-400', border: 'border-orange-500/20', bg: 'bg-orange-500/5' },
          { name: 'Groq Llama 3.3', role: 'Semantic AI Chaptering', color: 'text-amber-400', border: 'border-amber-500/20', bg: 'bg-amber-500/5' },
          { name: 'Transformers.js', role: 'Local Vector Embeddings', color: 'text-pink-400', border: 'border-pink-500/20', bg: 'bg-pink-500/5' },
          { name: 'Fluent-FFmpeg', role: 'Audio Extraction & Demuxing', color: 'text-indigo-400', border: 'border-indigo-500/20', bg: 'bg-indigo-500/5' }
        ].map((tech) => (
          <div key={tech.name} className={`p-5 rounded-xl border ${tech.border} ${tech.bg} hover:border-white/30 transition-colors`}>
            <div className={`font-bold ${tech.color} mb-1`}>{tech.name}</div>
            <div className="text-xs text-neutral-400">{tech.role}</div>
          </div>
        ))}
      </div>

      {/* Architecture Journey (Timeline) */}
      <h2 className="text-2xl font-semibold text-white mb-6">The Decoupled Journey</h2>
      <div className="space-y-6 border-l-2 border-white/10 ml-4 pl-8 relative pb-12">
        
        <div className="relative">
          <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-[#111] border-2 border-blue-500" />
          <h3 className="text-xl font-bold text-white mb-2">1. The API Boundary (Non-Blocking)</h3>
          <p className="text-neutral-400">The Express API accepts the video, returns a <code className="text-blue-300 bg-blue-900/30 px-1 rounded">202 Accepted</code> instantly, and pushes a job onto the Redis rail. It never cooks the meal; it only takes the order.</p>
        </div>

        <div className="relative">
          <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-[#111] border-2 border-purple-500" />
          <h3 className="text-xl font-bold text-white mb-2">2. Audio Demuxing</h3>
          <p className="text-neutral-400">Background workers pull the job and run <code className="text-purple-300 bg-purple-900/30 px-1 rounded">ffmpeg</code>. We extract just the 16kHz audio track, dumping the heavy pixel data because language models only listen, they don't look.</p>
        </div>

        <div className="relative">
          <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-[#111] border-2 border-emerald-500" />
          <h3 className="text-xl font-bold text-white mb-2">3. Defense in Depth (AI Processing)</h3>
          <p className="text-neutral-400">We ask Llama 3.3 70B for semantic judgment (where topics shift), but we do the exact timestamp math in our own code. All LLM outputs are piped through strict <code className="text-emerald-300 bg-emerald-900/30 px-1 rounded">Zod</code> schema validation. If the AI hallucinates, the worker throws and BullMQ safely retries it.</p>
        </div>

        <div className="relative">
          <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-[#111] border-2 border-orange-500" />
          <h3 className="text-xl font-bold text-white mb-2">4. Imperative Media Controls</h3>
          <p className="text-neutral-400">React is declarative, but media players are imperative. The frontend bridges this using <code className="text-orange-300 bg-orange-900/30 px-1 rounded">useImperativeHandle</code>, allowing search results and chapters to issue raw jump commands directly to the playhead without fighting the React render cycle.</p>
        </div>

      </div>
    </div>
  );
}