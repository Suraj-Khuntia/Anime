import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, X, SlidersHorizontal } from 'lucide-react';
import AnimeGrid from '../components/anime/AnimeGrid';
import TrailerModal from '../components/anime/TrailerModal';
import PageTransition from '../components/animations/PageTransition';
import { useDebounce } from '../hooks/useDebounce';
import { getAnimeList } from '../services/api';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [inputVal, setInputVal] = useState(queryParam);
  const debouncedTerm = useDebounce(inputVal, 400);

  const [animeList, setAnimeList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTrailer, setActiveTrailer] = useState(null);

  // Sync state if URL query changes
  useEffect(() => {
    if (queryParam !== inputVal) {
      setInputVal(queryParam);
    }
  }, [queryParam]);

  // Execute search when debounced value updates
  useEffect(() => {
    async function executeSearch() {
      if (!debouncedTerm || debouncedTerm.trim() === '') {
        setAnimeList([]);
        setTotalCount(0);
        setIsLoading(false);
        setSearchParams({});
        return;
      }

      setIsLoading(true);
      setSearchParams({ q: debouncedTerm.trim() });

      try {
        const res = await getAnimeList({
          search: debouncedTerm.trim(),
          limit: 30,
        });
        setAnimeList(res.data || []);
        setTotalCount(res.pagination?.total || 0);
      } catch (err) {
        console.error('Search query failed:', err);
      } finally {
        setIsLoading(false);
      }
    }

    executeSearch();
  }, [debouncedTerm]);

  return (
    <PageTransition className="space-y-8">
      {/* Search Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950/40 via-slate-900/60 to-slate-950 border border-slate-800 p-6 sm:p-10 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Search Anime Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Find series, movies, and specials by Japanese or English title, synopsis, and themes.
          </p>

          {/* Large Input */}
          <div className="relative flex items-center max-w-xl mx-auto pt-2">
            <SearchIcon className="absolute left-4 w-5 h-5 text-purple-400 pointer-events-none" />
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="e.g. Frieren, Titan, Hunter, Jujutsu..."
              autoFocus
              className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-slate-900/90 border border-purple-500/30 text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xl transition-all"
            />
            {inputVal && (
              <button
                onClick={() => setInputVal('')}
                className="absolute right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Header */}
      {debouncedTerm && (
        <div className="flex items-center justify-between px-1">
          <p className="text-sm font-semibold text-slate-300">
            Results for <span className="text-purple-400 font-bold">&quot;{debouncedTerm}&quot;</span> ({totalCount} found)
          </p>
        </div>
      )}

      {/* Results Grid */}
      <AnimeGrid
        animeList={animeList}
        isLoading={isLoading}
        onWatchTrailer={(anime) => setActiveTrailer(anime)}
        count={10}
      />

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={!!activeTrailer}
        onClose={() => setActiveTrailer(null)}
        trailerUrl={activeTrailer?.trailerUrl}
        title={activeTrailer?.titleEnglish || activeTrailer?.title || 'Anime'}
      />
    </PageTransition>
  );
}
