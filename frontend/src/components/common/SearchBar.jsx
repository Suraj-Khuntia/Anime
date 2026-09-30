import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Star, Film } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { getAnimeList } from '../../services/api';

export default function SearchBar({ placeholder = 'Search anime, movies, genres...', onSearchSubmit }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [quickResults, setQuickResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedTerm = useDebounce(searchTerm, 350);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Fetch quick suggestions on debounce
  useEffect(() => {
    let isMounted = true;

    async function fetchQuickSearch() {
      if (!debouncedTerm || debouncedTerm.trim().length < 2) {
        setQuickResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await getAnimeList({
          search: debouncedTerm.trim(),
          limit: 5,
        });
        if (isMounted) {
          setQuickResults(response.data || []);
        }
      } catch (err) {
        console.error('Quick search error:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchQuickSearch();
    return () => {
      isMounted = false;
    };
  }, [debouncedTerm]);

  // Click outside listener to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setIsOpen(false);
    if (onSearchSubmit) {
      onSearchSubmit(searchTerm.trim());
    } else {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleSelectAnime = (id) => {
    setIsOpen(false);
    setSearchTerm('');
    navigate(`/anime/${id}`);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-lg">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-inner"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setQuickResults([]);
            }}
            className="absolute right-3.5 text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && searchTerm.trim().length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800 backdrop-blur-xl">
          {isLoading ? (
            <div className="p-4 text-center text-xs text-slate-400">Searching anime catalog...</div>
          ) : quickResults.length > 0 ? (
            <>
              {quickResults.map((anime) => (
                <div
                  key={anime.id}
                  onClick={() => handleSelectAnime(anime.id)}
                  className="p-2.5 flex items-center gap-3 hover:bg-purple-950/40 cursor-pointer transition-colors"
                >
                  <img
                    src={anime.imageUrl}
                    alt={anime.title}
                    className="w-10 h-14 object-cover rounded-md flex-shrink-0 bg-slate-800 shadow"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-100 truncate hover:text-purple-300">
                      {anime.titleEnglish || anime.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                      <span className="flex items-center text-amber-400 font-medium">
                        <Star className="w-3 h-3 fill-amber-400 mr-1" />
                        {anime.score || 'N/A'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center">
                        <Film className="w-3 h-3 mr-1" />
                        {anime.type || 'TV'}
                      </span>
                      <span>•</span>
                      <span>{anime.status}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div
                onClick={handleSubmit}
                className="p-3 text-center text-xs font-semibold text-purple-400 hover:text-purple-300 hover:bg-slate-800/80 cursor-pointer transition-colors border-t border-slate-800"
              >
                View all results for &quot;{searchTerm}&quot; →
              </div>
            </>
          ) : (
            <div className="p-4 text-center text-xs text-slate-400">
              No anime found matching &quot;{searchTerm}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
