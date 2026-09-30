import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Star, Calendar, Film, Tv, Clock, Share2, ArrowLeft, ExternalLink, Sparkles, MonitorPlay } from 'lucide-react';
import AnimeCard from '../components/anime/AnimeCard';
import EpisodePlayer from '../components/anime/EpisodePlayer';
import EpisodeList from '../components/anime/EpisodeList';
import TrailerModal from '../components/anime/TrailerModal';
import Loader from '../components/common/Loader';
import PageTransition from '../components/animations/PageTransition';
import { getAnimeById, getAnimeEpisodes } from '../services/api';

const DEFAULT_POSTER = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500';

export default function AnimeDetail() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTrailer, setActiveTrailer] = useState(null);
  const [copied, setCopied] = useState(false);

  const playerRef = useRef(null);

  useEffect(() => {
    async function fetchDetail() {
      setIsLoading(true);
      setError(null);
      window.scrollTo(0, 0);

      try {
        const [animeRes, episodesRes] = await Promise.all([
          getAnimeById(id),
          getAnimeEpisodes(id),
        ]);

        if (animeRes.data) {
          setAnime(animeRes.data);
          const eps = episodesRes.data || animeRes.data.episodes || [];
          setEpisodes(eps);
          if (eps.length > 0) {
            setCurrentEpisode(eps[0]);
          }
        } else {
          setError('Anime not found');
        }
      } catch (err) {
        console.error('Failed to load anime detail:', err);
        setError('Could not load anime details');
      } finally {
        setIsLoading(false);
      }
    }

    fetchDetail();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectEpisode = (ep) => {
    setCurrentEpisode(ep);
    if (playerRef.current) {
      playerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleWatchEpisodeOne = () => {
    if (episodes.length > 0) {
      setCurrentEpisode(episodes[0]);
    }
    if (playerRef.current) {
      playerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  if (isLoading) {
    return <Loader message="Fetching anime details and episodes..." />;
  }

  if (error || !anime) {
    return (
      <div className="text-center py-24 space-y-4">
        <h2 className="text-2xl font-bold text-white">Oops! Anime Not Found</h2>
        <p className="text-slate-400 text-sm">The anime you requested doesn't seem to exist or couldn't be loaded.</p>
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>
    );
  }

  const displayTitle = anime.titleEnglish || anime.title;
  const releaseYear = anime.releaseDate ? new Date(anime.releaseDate).getFullYear() : null;
  const formattedDate = anime.releaseDate
    ? new Date(anime.releaseDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Unknown';

  return (
    <PageTransition className="space-y-12">
      {/* 1. Backdrop Hero Banner */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-8 sm:-mt-10 overflow-hidden min-h-[420px] md:min-h-[480px] bg-slate-950 flex items-end">
        {/* Blurred backdrop image with robust fallback */}
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-md scale-110 opacity-30"
          style={{ backgroundImage: `url(${anime.imageUrl || DEFAULT_POSTER})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f19] via-transparent to-[#0b0f19]" />

        {/* Back Link Floating */}
        <div className="absolute top-6 left-6 z-20">
          <Link
            to="/browse"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white text-xs font-semibold backdrop-blur-md transition-all shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Browse</span>
          </Link>
        </div>

        {/* Content overlaid on backdrop */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-24 w-full">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
            {/* Poster Card with Error Handling */}
            <div className="relative w-48 sm:w-56 md:w-64 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-700/80 flex-shrink-0 bg-slate-900 group">
              <img
                src={anime.imageUrl || DEFAULT_POSTER}
                alt={displayTitle}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DEFAULT_POSTER;
                }}
              />
              {anime.score && (
                <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-amber-400/40 text-amber-400 text-xs font-bold shadow-lg">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{anime.score.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Title & Headline Info */}
            <div className="space-y-3 text-center md:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-bold uppercase tracking-wider">
                  {anime.type || 'TV'}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-md text-xs font-bold tracking-wider uppercase ${
                    anime.status === 'Airing'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {anime.status}
                </span>
                {episodes.length > 0 && (
                  <span className="px-2.5 py-0.5 rounded-md bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-semibold">
                    {episodes.length} Episodes Available
                  </span>
                )}
                {releaseYear && (
                  <span className="text-slate-400 text-xs font-medium">
                    {releaseYear}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                {displayTitle}
              </h1>

              {anime.titleEnglish && anime.titleEnglish !== anime.title && (
                <p className="text-sm sm:text-base text-purple-300/80 font-medium">
                  {anime.title}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                {episodes.length > 0 && (
                  <button
                    onClick={handleWatchEpisodeOne}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <MonitorPlay className="w-4 h-4 fill-white" />
                    <span>Watch Episode 1</span>
                  </button>
                )}

                {anime.trailerUrl && (
                  <button
                    onClick={() => setActiveTrailer(anime)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-white font-bold text-sm backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Watch Trailer</span>
                  </button>
                )}

                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-slate-200 text-sm font-semibold backdrop-blur-md transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{copied ? 'Link Copied!' : 'Share'}</span>
                </button>

                {anime.externalId && (
                  <a
                    href={`https://myanimelist.net/anime/${anime.externalId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold transition-all"
                  >
                    <span>MyAnimeList</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Embedded Episode Video Player (Anchor for Watching) */}
      <div ref={playerRef} className="space-y-6 pt-2">
        {currentEpisode && (
          <section className="space-y-4">
            <EpisodePlayer
              anime={anime}
              episodes={episodes}
              currentEpisode={currentEpisode}
              onSelectEpisode={handleSelectEpisode}
            />
          </section>
        )}

        {/* Available Episodes Selector Grid */}
        {episodes.length > 0 && (
          <section>
            <EpisodeList
              episodes={episodes}
              currentEpisode={currentEpisode}
              onSelectEpisode={handleSelectEpisode}
              posterFallback={anime.imageUrl}
            />
          </section>
        )}
      </div>

      {/* 3. Main Body Grid: Synopsis & Details Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Synopsis and Genres */}
        <div className="lg:col-span-2 space-y-6">
          {/* Synopsis */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-lg space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Synopsis</span>
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {anime.synopsis || 'No synopsis provided for this anime.'}
            </p>
          </div>

          {/* Genres Section */}
          {anime.genres && anime.genres.length > 0 && (
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-lg space-y-3">
              <h3 className="text-lg font-bold text-white">Genres & Themes</h3>
              <div className="flex flex-wrap gap-2">
                {anime.genres.map((g) => (
                  <Link
                    key={g}
                    to={`/genres/${encodeURIComponent(g)}`}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-purple-950/50 hover:bg-purple-600 hover:text-white text-purple-300 border border-purple-500/30 transition-all"
                  >
                    {g}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Quick Metadata Card */}
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Anime Information
            </h3>

            <div className="divide-y divide-slate-800/80 text-xs sm:text-sm">
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Format</span>
                <span className="font-semibold text-slate-200">{anime.type || 'Unknown'}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Episodes Listed</span>
                <span className="font-semibold text-slate-200">{episodes.length} episodes</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Status</span>
                <span className="font-semibold text-slate-200">{anime.status}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">MAL Score</span>
                <span className="font-bold text-amber-400 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {anime.score ? anime.score.toFixed(2) : 'N/A'}
                </span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Aired From</span>
                <span className="font-semibold text-slate-200">{formattedDate}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">External ID</span>
                <span className="font-mono text-slate-400">#{anime.externalId}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Related / Recommended Anime */}
      {anime.related && anime.related.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Recommended If You Enjoyed This</h2>
              <p className="text-xs text-slate-400">Similar anime sharing genre tags and tone</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {anime.related.map((rel) => (
              <AnimeCard
                key={rel.id}
                anime={rel}
                onWatchTrailer={(a) => setActiveTrailer(a)}
              />
            ))}
          </div>
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
