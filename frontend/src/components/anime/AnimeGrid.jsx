import React from 'react';
import { motion } from 'framer-motion';
import AnimeCard from './AnimeCard';
import SkeletonCard from '../common/SkeletonCard';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
    },
  },
};

export default function AnimeGrid({ animeList = [], isLoading = false, onWatchTrailer, count = 10 }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!animeList || animeList.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-slate-900/40 rounded-2xl border border-slate-800">
        <p className="text-slate-300 text-lg font-medium">No anime found</p>
        <p className="text-slate-500 text-sm mt-1">Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6"
    >
      {animeList.map((anime) => (
        <motion.div key={anime.id} variants={itemVariants}>
          <AnimeCard anime={anime} onWatchTrailer={onWatchTrailer} />
        </motion.div>
      ))}
    </motion.div>
  );
}
