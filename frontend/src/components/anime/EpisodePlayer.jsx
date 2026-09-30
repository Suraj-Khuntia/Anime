import React, { useState } from 'react';
import { Play, ChevronLeft, ChevronRight, Tv, Server, CheckCircle2 } from 'lucide-react';

export default function EpisodePlayer({
  anime,
  episodes = [],
  currentEpisode,
  onSelectEpisode,
}) {
  const [selectedServer, setSelectedServer] = useState('Server 1 (HD)');
  const [autoplayNext, setAutoplayNext] = useState(true);

  if (!currentEpisode) return null;

  const currentEpNum = currentEpisode.episodeNumber;
  const totalEpisodes = episodes.length;

  const prevEp = episodes.find((e) => e.episodeNumber === currentEpNum - 1);
  const nextEp = episodes.find((e) => e.episodeNumber === currentEpNum + 1);

  // Format embed URL for smooth playback
  let playerUrl = currentEpisode.streamUrl || anime?.trailerUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ';
  if (playerUrl && playerUrl.includes('watch?v=')) {
    playerUrl = playerUrl.replace('watch?v=', 'embed/');
  }

  const handleNext = () => {
    if (nextEp) onSelectEpisode(nextEp);
  };

  const handlePrev = () => {
    if (prevEp) onSelectEpisode(prevEp);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
      {/* Player Header Bar */}
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-purple-600/30 text-purple-300 text-xs font-bold uppercase">
                Episode {currentEpNum}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-md">
                {currentEpisode.title}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Playing {anime?.titleEnglish || anime?.title}
            </p>
          </div>
        </div>

        {/* Server & Stream Switcher */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 mr-2">
            <Server className="w-3.5 h-3.5 text-purple-400" />
            <span>Server:</span>
          </div>
          {['Server 1 (HD)', 'Server 2 (Fast)'].map((srv) => (
            <button
              key={srv}
              onClick={() => setSelectedServer(srv)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedServer === srv
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {srv}
            </button>
          ))}
        </div>
      </div>

      {/* Main Video Frame */}
      <div className="relative aspect-video w-full bg-black">
        <iframe
          src={`${playerUrl}?autoplay=1&rel=0`}
          title={`Episode ${currentEpNum}: ${currentEpisode.title}`}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Player Controls & Episode Info Footer */}
      <div className="p-5 sm:p-6 bg-slate-950/60 border-t border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Previous / Next Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={!prevEp}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev Episode</span>
            </button>

            <button
              onClick={handleNext}
              disabled={!nextEp}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-lg shadow-purple-600/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <span>Next Episode</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Autoplay Next Toggle */}
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoplayNext}
                onChange={(e) => setAutoplayNext(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 bg-slate-800 border-slate-700 focus:ring-purple-500"
              />
              <span>Autoplay Next Episode</span>
            </label>
          </div>
        </div>

        {/* Episode Synopsis */}
        {currentEpisode.synopsis && (
          <div className="pt-3 border-t border-slate-800/80 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <span className="font-semibold text-purple-300 mr-2">Episode Summary:</span>
            {currentEpisode.synopsis}
          </div>
        )}
      </div>
    </div>
  );
}
