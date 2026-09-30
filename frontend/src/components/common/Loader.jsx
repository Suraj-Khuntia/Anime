import React from 'react';
import { Sparkles } from 'lucide-react';

export default function Loader({ message = 'Loading anime...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="relative flex items-center justify-center">
        <div className="w-14 h-14 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
        <Sparkles className="w-6 h-6 text-purple-400 absolute animate-pulse" />
      </div>
      <p className="mt-4 text-slate-400 text-sm font-medium tracking-wide animate-pulse">{message}</p>
    </div>
  );
}
