import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, Star, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

export default function HeroBanner({ spotlightList = [], onWatchTrailer }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto rotate banner every 6.5 seconds
  useEffect(() => {
    if (!spotlightList || spotlightList.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % spotlightList.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [spotlightList]);

  if (!spotlightList || spotlightList.length === 0) {
    return (
      <div className="relative w-full h-[480px] bg-slate-900 rounded-3xl animate-pulse flex items-center justify-center">
        <div className="text-slate-600 font-medium">Loading featured anime...</div>
      </div>
    );
  }

  const current = spotlightList[currentIndex];
  const displayTitle = current.titleEnglish || current.title;
  const year = current.releaseDate ? new Date(current.releaseDate).getFullYear() : null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? spotlightList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % spotlightList.length);
  };

  return (
    <div className="relative w-full h-[520px] sm:h-[560px] rounded-3xl overflow-hidden shadow-2xl border border-slate-800/80 group">
      {/* Background Poster Image with Blur & Gradients */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${current.imageUrl || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200'})` }}
        >
          {/* Multi-stage dark gradient overlays for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f19] via-[#0b0f19]/90 to-transparent sm:to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-[#0b0f19]/70" />
          <div className="absolute inset-0 backdrop-blur-[2px]" />
        </motion.div>
      </AnimatePresence>

      {/* Content Container */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 sm:px-12 flex flex-col justify-end pb-12 pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2.5 mb-3.5">
              <span className="px-3 py-1 rounded-full bg-purple-600/90 text-white text-xs font-bold tracking-wider uppercase shadow-lg shadow-purple-600/40">
                #Spotlight
              </span>
              {current.score && (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-300" />
                  {current.score.toFixed(1)} Rating
                </span>
              )}
              {current.type && (
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
                  {current.type}
                </span>
              )}
              {year && (
                <span className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  {year}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-md">
              {displayTitle}
            </h1>

            {current.titleEnglish && current.titleEnglish !== current.title && (
              <p className="text-sm sm:text-base text-purple-300/80 font-medium mt-1">
                {current.title}
              </p>
            )}

            {/* Synopsis */}
            {current.synopsis && (
              <p className="mt-3 text-sm sm:text-base text-slate-300 line-clamp-3 leading-relaxed drop-shadow">
                {current.synopsis}
              </p>
            )}

            {/* Genres */}
            {current.genres && (
              <div className="flex flex-wrap gap-2 mt-4">
                {current.genres.slice(0, 4).map((g) => (
                  <span
                    key={g}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-900/80 border border-slate-700/80 text-slate-200 backdrop-blur-md"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-3.5 mt-6">
              {current.trailerUrl && onWatchTrailer && (
                <button
                  onClick={() => onWatchTrailer(current)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Watch Trailer</span>
                </button>
              )}

              <Link
                to={`/anime/${current.id}`}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-slate-100 font-bold text-sm backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Info className="w-4 h-4 text-purple-400" />
                <span>Details & Episodes</span>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Prev / Next controls */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/60 hover:bg-purple-600 border border-slate-700/80 text-slate-200 hover:text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all z-20"
        title="Previous Spotlight"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/60 hover:bg-purple-600 border border-slate-700/80 text-slate-200 hover:text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all z-20"
        title="Next Spotlight"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Pagination indicators */}
      <div className="absolute bottom-4 right-6 sm:right-12 z-20 flex items-center gap-2">
        {spotlightList.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? 'w-8 bg-purple-500 shadow-lg shadow-purple-500/50'
                : 'w-2 bg-slate-700 hover:bg-slate-500'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
