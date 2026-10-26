import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  Flame,
  ListFilter,
  Sliders,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Film
} from 'lucide-react';

export default function DiscoveryTab({ settings, onSave, isSaving }) {
  const [discovery, setDiscovery] = useState(settings?.discovery || {});
  const [newPlaylist, setNewPlaylist] = useState({ title: '', subtitle: '', animeCount: 6 });
  const [newFilter, setNewFilter] = useState('');

  const handlePlaylistChange = (id, field, value) => {
    setDiscovery((prev) => ({
      ...prev,
      curatedPlaylists: (prev.curatedPlaylists || []).map((pl) =>
        pl.id === id ? { ...pl, [field]: value } : pl
      )
    }));
  };

  const handleAddPlaylist = () => {
    if (!newPlaylist.title.trim()) return;
    const pl = {
      id: 'pl_' + Date.now(),
      title: newPlaylist.title.trim(),
      subtitle: newPlaylist.subtitle.trim() || 'Curated anime collection',
      animeCount: parseInt(newPlaylist.animeCount) || 6,
      banner: 'hype'
    };
    setDiscovery((prev) => ({
      ...prev,
      curatedPlaylists: [...(prev.curatedPlaylists || []), pl]
    }));
    setNewPlaylist({ title: '', subtitle: '', animeCount: 6 });
  };

  const handleRemovePlaylist = (id) => {
    setDiscovery((prev) => ({
      ...prev,
      curatedPlaylists: (prev.curatedPlaylists || []).filter((pl) => pl.id !== id)
    }));
  };

  const handleAddFilter = () => {
    if (!newFilter.trim()) return;
    setDiscovery((prev) => ({
      ...prev,
      searchFilters: [...(prev.searchFilters || []), newFilter.trim()]
    }));
    setNewFilter('');
  };

  const handleRemoveFilter = (filter) => {
    setDiscovery((prev) => ({
      ...prev,
      searchFilters: (prev.searchFilters || []).filter((f) => f !== filter)
    }));
  };

  const handleWeightChange = (key, val) => {
    setDiscovery((prev) => ({
      ...prev,
      algorithmWeights: {
        ...(prev.algorithmWeights || {}),
        [key]: parseInt(val) || 0
      }
    }));
  };

  const handlePopularityChange = (key, val) => {
    setDiscovery((prev) => ({
      ...prev,
      popularityMetrics: {
        ...(prev.popularityMetrics || {}),
        [key]: parseInt(val) || 0
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ discovery });
  };

  const weights = discovery.algorithmWeights || { genreRelevance: 45, watchHistory: 35, starRatings: 20 };
  const popularity = discovery.popularityMetrics || {};

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-purple-400" />
            <span>UI, Discovery & Recommendation Algorithms</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Curate homepage playlists, adjust recommendation weights, manage custom search filters, and calibrate trending popularity metrics.
          </p>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Discovery Settings'}</span>
        </button>
      </div>

      {/* Curated Playlists */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Curated Homepage Playlists</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(discovery.curatedPlaylists || []).map((pl) => (
            <div
              key={pl.id}
              className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={pl.title}
                    onChange={(e) => handlePlaylistChange(pl.id, 'title', e.target.value)}
                    className="font-bold text-xs text-white bg-transparent border-b border-slate-700 focus:border-purple-500 focus:outline-none w-full mr-2 py-1"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePlaylist(pl.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <textarea
                  rows="2"
                  value={pl.subtitle}
                  onChange={(e) => handlePlaylistChange(pl.id, 'subtitle', e.target.value)}
                  className="w-full mt-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-700/60">
                <span>Anime in Playlist</span>
                <span className="font-bold text-purple-400">{pl.animeCount || 6} titles</span>
              </div>
            </div>
          ))}
        </div>

        {/* Add Playlist Form */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
          <input
            type="text"
            placeholder="Playlist title (e.g. Midnight Thrillers)"
            value={newPlaylist.title}
            onChange={(e) => setNewPlaylist({ ...newPlaylist, title: e.target.value })}
            className="sm:col-span-2 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
          <input
            type="text"
            placeholder="Subtitle / Tagline"
            value={newPlaylist.subtitle}
            onChange={(e) => setNewPlaylist({ ...newPlaylist, subtitle: e.target.value })}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddPlaylist}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Playlist</span>
          </button>
        </div>
      </div>

      {/* Recommendation Algorithm Weights */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span>Recommendation Engine Weighting Matrix</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700">
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
              <span>Genre Relevance</span>
              <span className="text-purple-400 font-mono font-bold">{weights.genreRelevance || 45}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weights.genreRelevance || 45}
              onChange={(e) => handleWeightChange('genreRelevance', e.target.value)}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400 mt-2">Shared tags, tropes, and thematic genre overlaps.</p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700">
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
              <span>Watch History Affinity</span>
              <span className="text-cyan-400 font-mono font-bold">{weights.watchHistory || 35}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weights.watchHistory || 35}
              onChange={(e) => handleWeightChange('watchHistory', e.target.value)}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400 mt-2">Recently finished series and user bookmark bookmarks.</p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700">
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
              <span>Global Star Ratings</span>
              <span className="text-amber-400 font-mono font-bold">{weights.starRatings || 20}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weights.starRatings || 20}
              onChange={(e) => handleWeightChange('starRatings', e.target.value)}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400 mt-2">MyAnimeList & community aggregate scores.</p>
          </div>
        </div>
      </div>

      {/* Popularity Metrics & Search Filters */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Flame className="w-4 h-4 text-rose-400" />
          <span>Popularity Metrics & Search Tag Filters</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              "Hot Right Now" Minimum View Threshold: <span className="text-purple-400 font-mono">{popularity.hotRightNowMinViews || 3500} views/day</span>
            </label>
            <input
              type="range"
              min="500"
              max="15000"
              step="500"
              value={popularity.hotRightNowMinViews || 3500}
              onChange={(e) => handlePopularityChange('hotRightNowMinViews', e.target.value)}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Trending Score Half-Life Decay: <span className="text-cyan-400 font-mono">{popularity.trendingDecayHalfLifeDays || 5} days</span>
            </label>
            <input
              type="range"
              min="1"
              max="14"
              value={popularity.trendingDecayHalfLifeDays || 5}
              onChange={(e) => handlePopularityChange('trendingDecayHalfLifeDays', e.target.value)}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Custom Search Filters */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-semibold text-slate-300">
            Active Community Search Filter Tags ({discovery.searchFilters?.length || 0})
          </label>
          <div className="flex flex-wrap gap-2.5">
            {(discovery.searchFilters || []).map((filter) => (
              <span
                key={filter}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200"
              >
                <span>#{filter}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFilter(filter)}
                  className="text-slate-500 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2 max-w-md">
            <input
              type="text"
              placeholder="Add tag (e.g. Studio Bones, Cyberpunk)..."
              value={newFilter}
              onChange={(e) => setNewFilter(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <button
              type="button"
              onClick={handleAddFilter}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-bold text-white flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Filter</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
