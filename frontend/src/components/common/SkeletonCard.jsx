import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden bg-slate-900/60 border border-slate-800/80 shadow-lg animate-pulse">
      {/* Poster shimmer placeholder */}
      <div className="relative aspect-[3/4] w-full bg-slate-800">
        <div className="absolute top-3 left-3 w-12 h-6 bg-slate-700/80 rounded-full" />
        <div className="absolute top-3 right-3 w-10 h-6 bg-slate-700/80 rounded-full" />
      </div>

      {/* Info shimmer */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="h-4 bg-slate-700/80 rounded-md w-3/4" />
        <div className="h-3 bg-slate-800 rounded-md w-1/2" />
        <div className="flex gap-1.5 mt-auto pt-2">
          <div className="h-5 bg-slate-800 rounded-md w-14" />
          <div className="h-5 bg-slate-800 rounded-md w-12" />
        </div>
      </div>
    </div>
  );
}
