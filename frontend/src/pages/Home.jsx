import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Star, Sparkles, ArrowRight, Compass } from 'lucide-react';
import HeroBanner from '../components/anime/HeroBanner';
import AnimeGrid from '../components/anime/AnimeGrid';
import TrailerModal from '../components/anime/TrailerModal';
import PageTransition from '../components/animations/PageTransition';
import { getAnimeList, getTrendingAnime, getGenres } from '../services/api';

export default function Home() {
  const [spotlightList, setSpotlightList] = useState([]);
  const [trendingList, setTrendingList] = useState([]);
  const [topRatedList, setTopRatedList] = useState([]);
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Trailer modal state
  const [activeTrailer, setActiveTrailer] = useState(null);

  useEffect(() => {
    async function loadHomeData() {
      setIsLoading(true);
      try {
        const [trendingRes, topRatedRes, genresRes] = await Promise.all([
          getTrendingAnime(10),
          getAnimeList({ sort: 'score_desc', limit: 10 }),
          getGenres(),
        ]);

        const trending = trendingRes.data || [];
        setTrendingList(trending);
        setSpotlightList(trending.slice(0, 5));
        setTopRatedList(topRatedRes.data || []);
        setGenres(genresRes.data || []);
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadHomeData();
  }, []);

  const handleWatchTrailer = (anime) => {
    setActiveTrailer(anime);
  };

  return (
    <PageTransition className="space-y-12">
      {/* 1. Hero Spotlight Carousel */}
      <section>
        <HeroBanner
          spotlightList={spotlightList}
          onWatchTrailer={handleWatchTrailer}
        />
      </section>

      {/* 2. Quick Genre Badges */}
      {genres.length > 0 && (
        <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              Popular Genres
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {genres.slice(0, 12).map((g) => (
              <Link
                key={g.id}
                to={`/genres/${encodeURIComponent(g.name)}`}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-purple-600 hover:text-white border border-slate-700/60 hover:border-purple-500 text-slate-300 transition-all shadow-sm"
              >
                {g.name} <span className="opacity-60 text-[10px]">({g.count})</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 3. Trending Now Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
              <Flame className="w-4 h-4 fill-orange-400" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Trending Anime
              </h2>
              <p className="text-xs text-slate-400">Popular and currently airing anime favorites</p>
            </div>
          </div>

          <Link
            to="/browse?status=Airing"
            className="flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors group"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <AnimeGrid
          animeList={trendingList.slice(0, 10)}
          isLoading={isLoading}
          onWatchTrailer={handleWatchTrailer}
          count={5}
        />
      </section>

      {/* 4. Top Rated Masterpieces */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                All-Time Highest Rated
              </h2>
              <p className="text-xs text-slate-400">Critically acclaimed anime legends</p>
            </div>
          </div>

          <Link
            to="/browse?sort=score_desc"
            className="flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors group"
          >
            <span>Explore Catalog</span>
            <Compass className="w-4 h-4 group-hover:rotate-45 transition-transform" />
          </Link>
        </div>

        <AnimeGrid
          animeList={topRatedList.slice(0, 10)}
          isLoading={isLoading}
          onWatchTrailer={handleWatchTrailer}
          count={5}
        />
      </section>

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
