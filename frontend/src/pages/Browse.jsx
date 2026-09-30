import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Compass, ChevronLeft, ChevronRight } from 'lucide-react';
import AnimeGrid from '../components/anime/AnimeGrid';
import FilterBar from '../components/anime/FilterBar';
import TrailerModal from '../components/anime/TrailerModal';
import PageTransition from '../components/animations/PageTransition';
import { getAnimeList, getGenres } from '../services/api';

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state sync
  const initialGenre = searchParams.get('genre') || 'All';
  const initialType = searchParams.get('type') || 'All';
  const initialStatus = searchParams.get('status') || 'All';
  const initialSort = searchParams.get('sort') || 'score_desc';
  const initialPage = parseInt(searchParams.get('page'), 10) || 1;

  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [selectedType, setSelectedType] = useState(initialType);
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [selectedSort, setSelectedSort] = useState(initialSort);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const [genres, setGenres] = useState([]);
  const [animeList, setAnimeList] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, page: 1, limit: 15 });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTrailer, setActiveTrailer] = useState(null);

  // Sync state when URL params change
  useEffect(() => {
    const g = searchParams.get('genre');
    const t = searchParams.get('type');
    const s = searchParams.get('status');
    const sort = searchParams.get('sort');
    const p = searchParams.get('page');

    if (g !== null) setSelectedGenre(g);
    if (t !== null) setSelectedType(t);
    if (s !== null) setSelectedStatus(s);
    if (sort !== null) setSelectedSort(sort);
    if (p !== null) setCurrentPage(parseInt(p, 10) || 1);
  }, [searchParams]);

  // Load genres
  useEffect(() => {
    async function loadGenres() {
      try {
        const res = await getGenres();
        setGenres(res.data || []);
      } catch (err) {
        console.error('Failed to load genres:', err);
      }
    }
    loadGenres();
  }, []);

  // Fetch anime based on active filters
  useEffect(() => {
    async function fetchCatalog() {
      setIsLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: 15,
          sort: selectedSort,
        };

        if (selectedGenre && selectedGenre !== 'All') params.genre = selectedGenre;
        if (selectedType && selectedType !== 'All') params.type = selectedType;
        if (selectedStatus && selectedStatus !== 'All') params.status = selectedStatus;

        const res = await getAnimeList(params);
        setAnimeList(res.data || []);
        setPagination(res.pagination || { total: 0, totalPages: 1, page: 1, limit: 15 });
      } catch (err) {
        console.error('Failed to fetch anime catalog:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCatalog();

    // Update query params in URL
    const newParams = {};
    if (selectedGenre !== 'All') newParams.genre = selectedGenre;
    if (selectedType !== 'All') newParams.type = selectedType;
    if (selectedStatus !== 'All') newParams.status = selectedStatus;
    if (selectedSort !== 'score_desc') newParams.sort = selectedSort;
    if (currentPage > 1) newParams.page = currentPage.toString();
    setSearchParams(newParams);
  }, [selectedGenre, selectedType, selectedStatus, selectedSort, currentPage]);

  const handleResetFilters = () => {
    setSelectedGenre('All');
    setSelectedType('All');
    setSelectedStatus('All');
    setSelectedSort('score_desc');
    setCurrentPage(1);
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setCurrentPage(newPage);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  return (
    <PageTransition className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30 shadow-lg shadow-purple-600/20">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Browse Anime Catalog
            </h1>
            <p className="text-xs text-slate-400">
              Showing {pagination.total} titles matching your preferences
            </p>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <FilterBar
        genres={genres}
        selectedGenre={selectedGenre}
        onSelectGenre={(g) => {
          setSelectedGenre(g);
          setCurrentPage(1);
        }}
        selectedType={selectedType}
        onSelectType={(t) => {
          setSelectedType(t);
          setCurrentPage(1);
        }}
        selectedStatus={selectedStatus}
        onSelectStatus={(s) => {
          setSelectedStatus(s);
          setCurrentPage(1);
        }}
        selectedSort={selectedSort}
        onSelectSort={(sort) => {
          setSelectedSort(sort);
          setCurrentPage(1);
        }}
        onReset={handleResetFilters}
      />

      {/* Grid */}
      <AnimeGrid
        animeList={animeList}
        isLoading={isLoading}
        onWatchTrailer={(anime) => setActiveTrailer(anime)}
        count={15}
      />

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs font-bold text-purple-300">
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pagination.totalPages}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

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
