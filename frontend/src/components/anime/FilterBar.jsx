import React from 'react';
import { Filter, RotateCcw, ArrowUpDown } from 'lucide-react';

export default function FilterBar({
  genres = [],
  selectedGenre,
  onSelectGenre,
  selectedType,
  onSelectType,
  selectedStatus,
  onSelectStatus,
  selectedSort,
  onSelectSort,
  onReset,
}) {
  const formats = ['All', 'TV', 'Movie', 'ONA', 'OVA'];
  const statuses = ['All', 'Airing', 'Completed', 'Upcoming'];
  const sortOptions = [
    { label: 'Highest Score', value: 'score_desc' },
    { label: 'Lowest Score', value: 'score_asc' },
    { label: 'Title (A-Z)', value: 'title_asc' },
    { label: 'Title (Z-A)', value: 'title_desc' },
    { label: 'Newest Release', value: 'release_desc' },
  ];

  return (
    <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-xl space-y-4">
      {/* Top row: Select controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-slate-300 font-semibold text-sm">
          <Filter className="w-4 h-4 text-purple-400" />
          <span>Filters</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Format / Type Select */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Format:</span>
            <select
              value={selectedType}
              onChange={(e) => onSelectType(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
            >
              {formats.map((fmt) => (
                <option key={fmt} value={fmt}>
                  {fmt}
                </option>
              ))}
            </select>
          </div>

          {/* Status Select */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => onSelectStatus(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
            >
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Select */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedSort}
              onChange={(e) => onSelectSort(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Button */}
          <button
            onClick={onReset}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Reset Filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Genre Pills */}
      <div className="pt-2 border-t border-slate-800/80">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => onSelectGenre('All')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedGenre === 'All'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
            }`}
          >
            All Genres
          </button>
          {genres.map((g) => {
            const name = typeof g === 'string' ? g : g.name;
            const isSelected = selectedGenre.toLowerCase() === name.toLowerCase();
            return (
              <button
                key={name}
                onClick={() => onSelectGenre(name)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                }`}
              >
                {name} {g.count ? `(${g.count})` : ''}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
