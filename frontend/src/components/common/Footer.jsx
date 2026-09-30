import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80 mt-20 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand info */}
          <div className="space-y-3 md:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Ani<span className="text-purple-400">Pulse</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm max-w-sm">
              Discover, search, and explore thousands of anime series, movies, and specials with live ratings, trailers, and comprehensive genre catalogs.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
              <span className="inline-block px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono">React</span>
              <span className="inline-block px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono">Node / Express</span>
              <span className="inline-block px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono">Prisma ORM</span>
              <span className="inline-block px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono">Framer Motion</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/" className="hover:text-purple-400 transition-colors">Home Spotlight</Link></li>
              <li><Link to="/browse" className="hover:text-purple-400 transition-colors">Browse Catalog</Link></li>
              <li><Link to="/browse?status=Airing" className="hover:text-purple-400 transition-colors">Top Airing</Link></li>
              <li><Link to="/browse?type=Movie" className="hover:text-purple-400 transition-colors">Anime Movies</Link></li>
            </ul>
          </div>

          {/* Col 3: Popular Genres */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">Top Genres</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/genres/Action" className="hover:text-purple-400 transition-colors">Action</Link></li>
              <li><Link to="/genres/Fantasy" className="hover:text-purple-400 transition-colors">Fantasy</Link></li>
              <li><Link to="/genres/Sci-Fi" className="hover:text-purple-400 transition-colors">Sci-Fi</Link></li>
              <li><Link to="/genres/Drama" className="hover:text-purple-400 transition-colors">Drama</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AniPulse. Data synced with Jikan / MyAnimeList API.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for anime lovers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
