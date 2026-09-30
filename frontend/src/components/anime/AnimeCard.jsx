import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Film, Play } from 'lucide-react';

export default function AnimeCard({ anime, onWatchTrailer }) {
  if (!anime) return null;

  const displayTitle = anime.titleEnglish || anime.title;
  const genres = Array.isArray(anime.genres) ? anime.genres : [];

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-slate-900/80 border border-slate-800/80 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-900/20 transition-all duration-300"
    >
      <Link to={`/anime/${anime.id}`} className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950">
        <img
          src={anime.imageUrl || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400'}
          alt={displayTitle}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400';
          }}
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30 opacity-70 group-hover:opacity-90 transition-opacity" />

        {/* Score Badge */}
        {anime.score && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-400/30 text-amber-400 text-xs font-bold shadow-md">
            <Star className="w-3 h-3 fill-amber-400" />
            <span>{anime.score.toFixed(1)}</span>
          </div>
        )}

        {/* Type / Format Badge */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-950/80 backdrop-blur-md border border-purple-500/30 text-purple-300 text-[11px] font-semibold">
          <Film className="w-3 h-3" />
          <span>{anime.type || 'TV'}</span>
        </div>

        {/* Quick trailer play button on hover */}
        {anime.trailerUrl && onWatchTrailer && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onWatchTrailer(anime);
            }}
            className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-lg shadow-purple-600/50 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 hover:bg-purple-500"
            title="Watch Trailer"
          >
            <Play className="w-5 h-5 fill-white translate-x-0.5" />
          </button>
        )}

        {/* Status Pill on bottom of poster */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase backdrop-blur-md ${
              anime.status === 'Airing'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : anime.status === 'Upcoming'
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                : 'bg-slate-700/50 text-slate-300 border border-slate-600/30'
            }`}
          >
            {anime.status || 'Finished'}
          </span>
          {anime.episodes && (
            <span className="text-[11px] font-medium text-slate-300 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm">
              {anime.episodes} eps
            </span>
          )}
        </div>
      </Link>

      {/* Info Container */}
      <div className="p-3.5 flex flex-col flex-1">
        <Link
          to={`/anime/${anime.id}`}
          className="text-sm font-bold text-slate-100 group-hover:text-purple-300 transition-colors line-clamp-1 leading-snug"
          title={displayTitle}
        >
          {displayTitle}
        </Link>

        {anime.titleEnglish && anime.titleEnglish !== anime.title && (
          <p className="text-[11px] text-slate-400 truncate mt-0.5">
            {anime.title}
          </p>
        )}

        {/* Genre Tags */}
        <div className="flex flex-wrap gap-1 mt-auto pt-2.5">
          {genres.slice(0, 3).map((genre) => (
            <Link
              key={genre}
              to={`/genres/${encodeURIComponent(genre)}`}
              onClick={(e) => e.stopPropagation()}
              className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 hover:bg-purple-900/40 text-slate-300 hover:text-purple-300 transition-colors"
            >
              {genre}
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
