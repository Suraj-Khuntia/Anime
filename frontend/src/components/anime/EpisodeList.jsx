import React, { useState } from 'react';
import { Play, Search, Clock, CheckCircle2 } from 'lucide-react';

export default function EpisodeList({
  episodes = [],
  currentEpisode,
  onSelectEpisode,
  posterFallback,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRangeIndex, setActiveRangeIndex] = useState(0);

  const BATCH_SIZE = 25;
  const totalEpisodes = episodes.length;

  // Group episodes into batches of 25 (e.g. 1-25, 26-50)
  const ranges = [];
  for (let i = 0; i < totalEpisodes; i += BATCH_SIZE) {
    const start = i + 1;
    const end = Math.min(i + BATCH_SIZE, totalEpisodes);
    ranges.push({ label: `${start} - ${end}`, start, end });
  }

  // Filter episodes by range and search query
  const filteredEpisodes = episodes.filter((ep) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      ep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.episodeNumber.toString() === searchQuery.trim();

    if (searchQuery.trim() !== '') return matchesSearch;

    const currentRange = ranges[activeRangeIndex];
    if (!currentRange) return true;
    return ep.episodeNumber >= currentRange.start && ep.episodeNumber <= currentRange.end;
  });

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-xl space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Available Episodes</span>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-300 text-xs font-semibold">
              {totalEpisodes} Episodes
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Select any episode to stream instantly
          </p>
        </div>

        {/* Episode Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ep # or title..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Batch Ranges for Anime with many episodes */}
      {ranges.length > 1 && searchQuery.trim() === '' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-slate-400 mr-1 whitespace-nowrap">Ranges:</span>
          {ranges.map((range, idx) => (
            <button
              key={range.label}
              onClick={() => setActiveRangeIndex(idx)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeRangeIndex === idx
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      )}

      {/* Episode Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[520px] overflow-y-auto pr-1">
        {filteredEpisodes.map((ep) => {
          const isPlaying = currentEpisode?.episodeNumber === ep.episodeNumber;
          return (
            <div
              key={ep.id || ep.episodeNumber}
              onClick={() => onSelectEpisode(ep)}
              className={`group relative flex items-center gap-3 p-2.5 rounded-2xl border transition-all cursor-pointer ${
                isPlaying
                  ? 'bg-purple-950/60 border-purple-500 shadow-lg shadow-purple-900/30 ring-1 ring-purple-500'
                  : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60 hover:border-slate-600'
              }`}
            >
              {/* Thumbnail / Ep Number badge */}
              <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0 flex items-center justify-center">
                <img
                  src={ep.thumbnailUrl || posterFallback}
                  alt={ep.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = posterFallback || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300';
                  }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-purple-950/40 transition-colors flex items-center justify-center">
                  <Play className={`w-4 h-4 text-white transition-transform ${isPlaying ? 'scale-110 fill-white' : 'group-hover:scale-110'}`} />
                </div>
              </div>

              {/* Title & Metadata */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${isPlaying ? 'text-purple-300' : 'text-slate-400'}`}>
                    EP {ep.episodeNumber}
                  </span>
                  {isPlaying && (
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                  )}
                </div>
                <p className={`text-xs font-semibold truncate mt-0.5 ${isPlaying ? 'text-white font-bold' : 'text-slate-200 group-hover:text-purple-300'}`}>
                  {ep.title}
                </p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                  <span className="flex items-center gap-0.5">
                    <Clock className="w-3 h-3" />
                    {ep.duration || 24}m
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
