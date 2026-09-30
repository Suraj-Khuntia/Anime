import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Flame, Compass, Sparkles, RefreshCw, Menu, X, Layers, Shield, ChevronDown, LogOut, User } from 'lucide-react';
import SearchBar from './SearchBar';
import { triggerDataSync } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);
  const location = useLocation();

  const { currentUser, isUserLoggedIn, userLogout, openAuthModal } = useAuth();

  const handleSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncStatus('Syncing...');
    try {
      const res = await triggerDataSync();
      setSyncStatus(`Synced ${res.result?.itemsSynced || 0}!`);
      setTimeout(() => {
        setSyncStatus(null);
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error('Sync failed:', err);
      setSyncStatus('Sync error');
      setTimeout(() => setSyncStatus(null), 3000);
    } finally {
      setIsSyncing(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Browse', path: '/browse', icon: Compass },
    { name: 'Trending', path: '/browse?status=Airing', icon: Flame },
    { name: 'Genres', path: '/browse#genres', icon: Layers },
    { name: 'Admin', path: '/admin', icon: Shield },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname + location.search === path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass-nav border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-400 bg-clip-text text-transparent">
              Ani<span className="text-purple-400">Pulse</span>
            </span>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <SearchBar />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-purple-600/20 text-purple-300 font-semibold border border-purple-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Actions: Sync & User Profile / Auth */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={handleSync}
              disabled={isSyncing}
              title="Sync latest anime catalog from Jikan API"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-purple-900/40 border border-slate-700/80 hover:border-purple-500/50 text-xs font-semibold text-slate-300 hover:text-purple-200 transition-all shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-purple-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{syncStatus || 'Sync'}</span>
            </button>

            {/* User Profile or Sign In / Sign Up Buttons */}
            {isUserLoggedIn && currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 py-1 px-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-xs text-slate-200 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 overflow-hidden flex items-center justify-center text-white font-bold text-xs uppercase shadow-sm">
                    {currentUser.avatarUrl ? (
                      <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{currentUser.name ? currentUser.name.charAt(0) : 'U'}</span>
                    )}
                  </div>
                  <span className="max-w-[100px] truncate font-medium">{currentUser.name || 'User'}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 bg-[#0f172a] border border-slate-700/90 rounded-xl shadow-2xl p-2 z-50 animate-fadeIn backdrop-blur-xl"
                  >
                    <div className="px-3 py-2 border-b border-slate-800 mb-1">
                      <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-purple-900/30 hover:text-purple-300 transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-purple-400" />
                      <span>My Profile</span>
                    </Link>
                    <button
                      onClick={() => {
                        userLogout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/15 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('signin')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-semibold text-white shadow-md shadow-purple-600/30 transition-all"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0b0f19]/95 px-4 pt-3 pb-6 space-y-3 backdrop-blur-xl">
          <div className="pb-2">
            <SearchBar onSearchSubmit={() => setIsMobileMenuOpen(false)} />
          </div>
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-purple-900/30 hover:text-purple-300"
              >
                {link.icon && <link.icon className="w-4 h-4 text-purple-400" />}
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          {/* User Auth Section in Mobile */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            {isUserLoggedIn && currentUser ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-purple-600 overflow-hidden flex items-center justify-center text-white font-bold text-xs uppercase shadow">
                      {currentUser.avatarUrl ? (
                        <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                      ) : (
                        <span>{currentUser.name ? currentUser.name.charAt(0) : 'U'}</span>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">{currentUser.name}</p>
                      <p className="text-[10px] text-slate-400">{currentUser.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      userLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-lg text-xs font-medium"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-purple-900/20 border border-purple-500/30 text-xs font-semibold text-purple-300 hover:bg-purple-900/40"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-purple-400" />
                    <span>My Profile & Settings</span>
                  </div>
                  <span>→</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    openAuthModal('signin');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    openAuthModal('signup');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white shadow-md shadow-purple-600/30"
                >
                  Sign Up
                </button>
              </div>
            )}

            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{syncStatus || 'Sync Latest Anime (Jikan)'}</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
