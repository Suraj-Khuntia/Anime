import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layers, ArrowLeft } from 'lucide-react';
import AnimeGrid from '../components/anime/AnimeGrid';
import TrailerModal from '../components/anime/TrailerModal';
import PageTransition from '../components/animations/PageTransition';
import { getAnimeList } from '../services/api';

export default function GenrePage() {
  const { name } = useParams();
  const [animeList, setAnimeList] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTrailer, setActiveTrailer] = useState(null);

  useEffect(() => {
    async function fetchByGenre() {
      setIsLoading(true);
      window.scrollTo(0, 0);
      try {
        const res = await getAnimeList({
          genre: name,
          limit: 30,
          sort: 'score_desc',
        });
        setAnimeList(res.data || []);
        setTotal(res.pagination?.total || 0);
      } catch (err) {
        console.error('Failed to fetch genre anime:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchByGenre();
  }, [name]);

  return (
    <PageTransition className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {name} Anime
            </h1>
            <p className="text-xs text-slate-400">
              Discover {total} top-rated series and movies tagged with {name}
            </p>
          </div>
        </div>

        <Link
          to="/browse"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white text-xs font-semibold transition-all self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Categories</span>
        </Link>
      </div>

      {/* Grid */}
      <AnimeGrid
        animeList={animeList}
        isLoading={isLoading}
        onWatchTrailer={(a) => setActiveTrailer(a)}
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
