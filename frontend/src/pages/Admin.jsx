import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Film,
  Tv,
  Layers,
  RefreshCw,
  Plus,
  Search,
  Edit2,
  Trash2,
  Star,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Play,
  ArrowRight,
  Shield,
  Clock,
  LogOut,
  User
} from 'lucide-react';
import AnimeModal from '../components/admin/AnimeModal';
import EpisodeModal from '../components/admin/EpisodeModal';
import PageTransition from '../components/animations/PageTransition';
import AdminLogin from './AdminLogin';
import { useAuth } from '../context/AuthContext';
import {
  getAdminStats,
  getAnimeList,
  createAnime,
  updateAnime,
  deleteAnime,
  getAnimeEpisodes,
  createEpisode,
  updateEpisode,
  deleteEpisode,
  getGenres,
  createGenre,
  updateGenre,
  deleteGenre,
  triggerDataSync,
  getSyncLogs
} from '../services/api';

export default function Admin() {
  const { isAuthenticated, isLoading: isAuthLoading, adminUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Stats state
  const [stats, setStats] = useState(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Anime table state
  const [animeList, setAnimeList] = useState([]);
  const [animeSearch, setAnimeSearch] = useState('');
  const [animePage, setAnimePage] = useState(1);
  const [animeTotalPages, setAnimeTotalPages] = useState(1);
  const [isLoadingAnime, setIsLoadingAnime] = useState(false);

  // Anime modal state
  const [isAnimeModalOpen, setIsAnimeModalOpen] = useState(false);
  const [editingAnime, setEditingAnime] = useState(null);

  // Episodes tab state
  const [allAnimeOptions, setAllAnimeOptions] = useState([]);
  const [selectedAnimeId, setSelectedAnimeId] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(false);
  const [isEpisodeModalOpen, setIsEpisodeModalOpen] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState(null);

  // Genres state
  const [genres, setGenres] = useState([]);
  const [newGenreName, setNewGenreName] = useState('');
  const [editingGenreId, setEditingGenreId] = useState(null);
  const [editingGenreName, setEditingGenreName] = useState('');

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);
  const [syncLogs, setSyncLogs] = useState([]);

  // Notification / Alert banner
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  // 1. Load Admin Stats
  const loadStats = async () => {
    setIsLoadingStats(true);
    try {
      const res = await getAdminStats();
      if (res.data) setStats(res.data);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setIsLoadingStats(false);
    }
  };

  // 2. Load Anime Table
  const loadAnime = async (page = 1, search = '') => {
    setIsLoadingAnime(true);
    try {
      const res = await getAnimeList({
        page,
        limit: 15,
        search,
        sort: 'score_desc',
      });
      setAnimeList(res.data || []);
      setAnimeTotalPages(res.pagination?.totalPages || 1);
      setAnimePage(page);
    } catch (err) {
      console.error('Failed to load anime list:', err);
    } finally {
      setIsLoadingAnime(false);
    }
  };

  // 3. Load all anime for episode dropdown
  const loadAllAnimeForDropdown = async () => {
    try {
      const res = await getAnimeList({ limit: 100, sort: 'title_asc' });
      const items = res.data || [];
      setAllAnimeOptions(items);
      if (items.length > 0 && !selectedAnimeId) {
        setSelectedAnimeId(items[0].id);
      }
    } catch (err) {
      console.error('Failed to load anime dropdown options:', err);
    }
  };

  // 4. Load episodes for selected anime
  const loadEpisodesForAnime = async (animeId) => {
    if (!animeId) return;
    setIsLoadingEpisodes(true);
    try {
      const res = await getAnimeEpisodes(animeId);
      setEpisodes(res.data || []);
    } catch (err) {
      console.error('Failed to load episodes:', err);
    } finally {
      setIsLoadingEpisodes(false);
    }
  };

  // 5. Load Genres
  const loadGenresData = async () => {
    try {
      const res = await getGenres();
      setGenres(res.data || []);
    } catch (err) {
      console.error('Failed to load genres:', err);
    }
  };

  // 6. Load Sync Logs
  const loadLogs = async () => {
    try {
      const res = await getSyncLogs();
      setSyncLogs(res.data || []);
    } catch (err) {
      console.error('Failed to load sync logs:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadStats();
      loadAnime(1, '');
      loadAllAnimeForDropdown();
      loadGenresData();
      loadLogs();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && selectedAnimeId) {
      loadEpisodesForAnime(selectedAnimeId);
    }
  }, [isAuthenticated, selectedAnimeId]);

  // Handle Anime Actions
  const handleSaveAnime = async (formData) => {
    if (editingAnime) {
      await updateAnime(editingAnime.id, formData);
      showAlert(`Updated anime: ${formData.title}`);
    } else {
      await createAnime(formData);
      showAlert(`Created new anime: ${formData.title}`);
    }
    loadAnime(animePage, animeSearch);
    loadStats();
    loadAllAnimeForDropdown();
    loadGenresData();
  };

  const handleDeleteAnime = async (anime) => {
    if (window.confirm(`Are you sure you want to delete "${anime.titleEnglish || anime.title}"? This will also remove all its episodes.`)) {
      try {
        await deleteAnime(anime.id);
        showAlert(`Deleted "${anime.titleEnglish || anime.title}"`, 'success');
        loadAnime(animePage, animeSearch);
        loadStats();
        loadAllAnimeForDropdown();
      } catch (err) {
        showAlert(err.message || 'Failed to delete anime', 'error');
      }
    }
  };

  // Handle Episode Actions
  const handleSaveEpisode = async (formData) => {
    if (editingEpisode) {
      await updateEpisode(selectedAnimeId, editingEpisode.episodeNumber, formData);
      showAlert(`Updated Episode ${formData.episodeNumber}`);
    } else {
      await createEpisode(selectedAnimeId, formData);
      showAlert(`Created Episode ${formData.episodeNumber}`);
    }
    loadEpisodesForAnime(selectedAnimeId);
    loadStats();
  };

  const handleDeleteEpisode = async (ep) => {
    if (window.confirm(`Delete Episode ${ep.episodeNumber}: "${ep.title}"?`)) {
      try {
        await deleteEpisode(selectedAnimeId, ep.episodeNumber);
        showAlert(`Deleted Episode ${ep.episodeNumber}`);
        loadEpisodesForAnime(selectedAnimeId);
        loadStats();
      } catch (err) {
        showAlert(err.message || 'Failed to delete episode', 'error');
      }
    }
  };

  // Handle Genre Actions
  const handleCreateGenre = async (e) => {
    e.preventDefault();
    if (!newGenreName.trim()) return;
    try {
      await createGenre(newGenreName.trim());
      setNewGenreName('');
      showAlert(`Genre "${newGenreName}" created!`);
      loadGenresData();
      loadStats();
    } catch (err) {
      showAlert(err.message || 'Failed to create genre', 'error');
    }
  };

  const handleUpdateGenre = async (id) => {
    if (!editingGenreName.trim()) return;
    try {
      await updateGenre(id, editingGenreName.trim());
      setEditingGenreId(null);
      setEditingGenreName('');
      showAlert('Genre updated successfully!');
      loadGenresData();
    } catch (err) {
      showAlert(err.message || 'Failed to update genre', 'error');
    }
  };

  const handleDeleteGenre = async (genre) => {
    if (window.confirm(`Delete genre "${genre.name}"?`)) {
      try {
        await deleteGenre(genre.id);
        showAlert(`Genre "${genre.name}" deleted!`);
        loadGenresData();
        loadStats();
      } catch (err) {
        showAlert(err.message || 'Failed to delete genre', 'error');
      }
    }
  };

  // Handle Manual Sync
  const handleTriggerSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncStatus('Connecting to Jikan API and syncing anime...');
    try {
      const res = await triggerDataSync();
      showAlert(`Sync completed: ${res.result?.itemsSynced || 0} items processed!`);
      loadStats();
      loadAnime(1, '');
      loadAllAnimeForDropdown();
      loadGenresData();
      loadLogs();
    } catch (err) {
      console.error('Sync failed:', err);
      showAlert(err.message || 'Sync failed', 'error');
    } finally {
      setIsSyncing(false);
      setSyncStatus(null);
    }
  };

  const selectedAnimeObj = allAnimeOptions.find((a) => a.id === selectedAnimeId);

  if (isAuthLoading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto" />
        <p className="text-slate-400 text-xs mt-3">Verifying admin credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => {}} />;
  }

  return (
    <PageTransition className="space-y-8">
      {/* Admin Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center text-white shadow-xl shadow-purple-600/30">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  AniPulse Admin Panel
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-600 text-white tracking-wider">
                  Master
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Manage anime catalog, episodes, streaming links, genres, and external sync jobs
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
              <User className="w-3.5 h-3.5 text-purple-400" />
              <span>{adminUser?.username || 'admin'}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/40 border border-slate-700 hover:border-rose-500/50 text-xs font-semibold text-slate-300 hover:text-rose-300 transition-all"
              title="Logout from admin session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
            <button
              onClick={handleTriggerSync}
              disabled={isSyncing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Jikan API'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Alert Notification Toast */}
      {alert && (
        <div
          className={`p-4 rounded-2xl border text-sm font-semibold flex items-center gap-3 shadow-lg transition-all ${
            alert.type === 'error'
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-200'
              : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200'
          }`}
        >
          {alert.type === 'error' ? (
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
          ) : (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          )}
          <span>{alert.message}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {[
          { id: 'overview', label: 'Overview & Stats', icon: LayoutDashboard },
          { id: 'anime', label: 'Anime Catalog', icon: Film },
          { id: 'episodes', label: 'Episode Manager', icon: Tv },
          { id: 'genres', label: 'Genres Taxonomy', icon: Layers },
          { id: 'sync', label: 'Sync & Logs', icon: RefreshCw },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================
          TAB 1: OVERVIEW & STATS
         ======================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* KPI Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                <span>Total Anime</span>
                <Film className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-3xl font-black text-white mt-2">
                {isLoadingStats ? '...' : stats?.totalAnime || 0}
              </p>
              <p className="text-xs text-slate-500 mt-1">Titles in active database</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                <span>Total Episodes</span>
                <Tv className="w-4 h-4 text-indigo-400" />
              </div>
              <p className="text-3xl font-black text-white mt-2">
                {isLoadingStats ? '...' : stats?.totalEpisodes || 0}
              </p>
              <p className="text-xs text-slate-500 mt-1">Streamable anime episodes</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                <span>Genre Categories</span>
                <Layers className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-3xl font-black text-white mt-2">
                {isLoadingStats ? '...' : stats?.totalGenres || 0}
              </p>
              <p className="text-xs text-slate-500 mt-1">Active taxonomy categories</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                <span>Sync Health</span>
                <RefreshCw className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-lg font-bold text-emerald-400 mt-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5" />
                <span>Operational</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">Cron runs every 6 hours</p>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                setEditingAnime(null);
                setIsAnimeModalOpen(true);
              }}
              className="flex items-center justify-between p-5 rounded-2xl bg-purple-950/30 hover:bg-purple-900/40 border border-purple-500/30 text-left transition-all group"
            >
              <div>
                <h4 className="text-base font-bold text-white group-hover:text-purple-300">
                  + Add New Anime
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Insert custom title, poster, trailer, and genres
                </p>
              </div>
              <Plus className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
            </button>

            <button
              onClick={() => setActiveTab('episodes')}
              className="flex items-center justify-between p-5 rounded-2xl bg-indigo-950/30 hover:bg-indigo-900/40 border border-indigo-500/30 text-left transition-all group"
            >
              <div>
                <h4 className="text-base font-bold text-white group-hover:text-indigo-300">
                  Manage Episodes
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure streaming URLs, titles, and thumbnails
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-indigo-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setActiveTab('genres')}
              className="flex items-center justify-between p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-800 border border-slate-700/60 text-left transition-all group"
            >
              <div>
                <h4 className="text-base font-bold text-white group-hover:text-cyan-300">
                  Manage Genres
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Add, rename, or organize catalog genres
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Recent Sync History */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <span>Recent Sync Operations</span>
              </h3>
              <button
                onClick={loadLogs}
                className="text-xs font-semibold text-purple-400 hover:text-purple-300"
              >
                Refresh Logs
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="pb-3 font-semibold">Timestamp</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Items Synced</th>
                    <th className="pb-3 font-semibold">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {syncLogs.slice(0, 5).map((log) => (
                    <tr key={log.id}>
                      <td className="py-3 text-slate-400">
                        {new Date(log.runAt).toLocaleString()}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            log.status === 'success'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3 font-semibold text-white">{log.itemsSynced || 0}</td>
                      <td className="py-3 text-slate-400 max-w-xs truncate">{log.message}</td>
                    </tr>
                  ))}
                  {syncLogs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-slate-500">
                        No sync logs recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: ANIME CATALOG (CRUD)
         ======================================================== */}
      {activeTab === 'anime' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={animeSearch}
                onChange={(e) => {
                  setAnimeSearch(e.target.value);
                  loadAnime(1, e.target.value);
                }}
                placeholder="Search anime catalog by title..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <button
              onClick={() => {
                setEditingAnime(null);
                setIsAnimeModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Anime</span>
            </button>
          </div>

          {/* Anime Table */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-xl shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Anime</th>
                    <th className="py-3.5 px-4">Format</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Score</th>
                    <th className="py-3.5 px-4">Episodes</th>
                    <th className="py-3.5 px-4">Genres</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {animeList.map((item) => (
                    <tr key={item.id} className="hover:bg-purple-950/20 transition-colors">
                      {/* Poster & Title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-10 h-14 object-cover rounded-lg bg-slate-800 flex-shrink-0 shadow"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                          <div className="min-w-0 max-w-xs sm:max-w-sm">
                            <p className="font-bold text-white truncate hover:text-purple-300">
                              {item.titleEnglish || item.title}
                            </p>
                            {item.titleEnglish && item.titleEnglish !== item.title && (
                              <p className="text-[10px] text-slate-400 truncate mt-0.5">
                                {item.title}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Format */}
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold text-[11px]">
                          {item.type || 'TV'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            item.status === 'Airing'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* Score */}
                      <td className="py-3 px-4 font-bold text-amber-400">
                        {item.score ? (
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400" />
                            {item.score.toFixed(1)}
                          </span>
                        ) : (
                          'N/A'
                        )}
                      </td>

                      {/* Episodes */}
                      <td className="py-3 px-4">
                        <span className="text-slate-300 font-medium">
                          {item.episodesAvailable || 0} / {item.episodes || '—'}
                        </span>
                      </td>

                      {/* Genres */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {(item.genres || []).slice(0, 3).map((g) => (
                            <span
                              key={g}
                              className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400"
                            >
                              {g}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedAnimeId(item.id);
                              setActiveTab('episodes');
                            }}
                            title="Manage Episodes for this anime"
                            className="p-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-800/80 border border-indigo-500/30 text-indigo-300 hover:text-white transition-colors"
                          >
                            <Tv className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingAnime(item);
                              setIsAnimeModalOpen(true);
                            }}
                            title="Edit Anime Details"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-purple-900/50 border border-slate-700 text-slate-300 hover:text-purple-300 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteAnime(item)}
                            title="Delete Anime"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 border border-slate-700 text-slate-300 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {animeList.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        {isLoadingAnime ? 'Loading anime entries...' : 'No anime found matching your query.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {animeTotalPages > 1 && (
              <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Page {animePage} of {animeTotalPages}</span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={animePage === 1}
                    onClick={() => loadAnime(animePage - 1, animeSearch)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 disabled:opacity-40 hover:text-white"
                  >
                    Previous
                  </button>
                  <button
                    disabled={animePage === animeTotalPages}
                    onClick={() => loadAnime(animePage + 1, animeSearch)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 disabled:opacity-40 hover:text-white"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: EPISODE MANAGER
         ======================================================== */}
      {activeTab === 'episodes' && (
        <div className="space-y-6">
          {/* Header & Anime Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/70 border border-slate-800 p-5 rounded-3xl backdrop-blur-xl shadow-xl">
            <div className="flex-1 max-w-md">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Select Anime to Manage Episodes:
              </label>
              <select
                value={selectedAnimeId || ''}
                onChange={(e) => setSelectedAnimeId(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
              >
                {allAnimeOptions.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.titleEnglish || a.title} ({a.episodesAvailable || 0} episodes)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setEditingEpisode(null);
                  setIsEpisodeModalOpen(true);
                }}
                disabled={!selectedAnimeId}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>Add Episode</span>
              </button>
            </div>
          </div>

          {/* Episode List for Selected Anime */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-xl shadow-xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">
                  {selectedAnimeObj?.titleEnglish || selectedAnimeObj?.title || 'Selected Anime'} Episodes
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Total of {episodes.length} streamable episodes configured
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Ep #</th>
                    <th className="py-3 px-4">Title & Synopsis</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Stream URL</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {episodes.map((ep) => (
                    <tr key={ep.id} className="hover:bg-purple-950/20 transition-colors">
                      <td className="py-3 px-4 font-bold text-purple-400">
                        EP {ep.episodeNumber}
                      </td>
                      <td className="py-3 px-4 max-w-md">
                        <p className="font-semibold text-white">{ep.title}</p>
                        {ep.synopsis && (
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {ep.synopsis}
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-300">
                        {ep.duration || 24}m
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate text-slate-400">
                        {ep.streamUrl ? (
                          <a
                            href={ep.streamUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-purple-400 hover:underline flex items-center gap-1"
                          >
                            <Play className="w-3 h-3" />
                            <span className="truncate">{ep.streamUrl}</span>
                          </a>
                        ) : (
                          <span className="text-slate-600">No stream link</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditingEpisode(ep);
                              setIsEpisodeModalOpen(true);
                            }}
                            title="Edit Episode"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-purple-900/50 border border-slate-700 text-slate-300 hover:text-purple-300"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteEpisode(ep)}
                            title="Delete Episode"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 border border-slate-700 text-slate-300 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {episodes.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400">
                        {isLoadingEpisodes ? 'Loading episodes...' : 'No episodes recorded for this anime yet.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: GENRES TAXONOMY
         ======================================================== */}
      {activeTab === 'genres' && (
        <div className="space-y-6">
          {/* Add Genre Card */}
          <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-3xl backdrop-blur-xl shadow-xl">
            <h3 className="text-base font-bold text-white mb-3">Add New Genre</h3>
            <form onSubmit={handleCreateGenre} className="flex gap-3 max-w-md">
              <input
                type="text"
                required
                value={newGenreName}
                onChange={(e) => setNewGenreName(e.target.value)}
                placeholder="e.g. Cyberpunk, Isekai, Mecha..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all"
              >
                Add Genre
              </button>
            </form>
          </div>

          {/* Genre Grid */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white">
              All Genres ({genres.length})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {genres.map((g) => (
                <div
                  key={g.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-purple-500/40 transition-colors"
                >
                  {editingGenreId === g.id ? (
                    <div className="flex items-center gap-1.5 flex-1 mr-2">
                      <input
                        type="text"
                        value={editingGenreName}
                        onChange={(e) => setEditingGenreName(e.target.value)}
                        className="w-full px-2 py-1 rounded bg-slate-900 border border-purple-500 text-xs text-white"
                        autoFocus
                      />
                      <button
                        onClick={() => handleUpdateGenre(g.id)}
                        className="px-2 py-1 rounded bg-purple-600 text-white text-[10px] font-bold"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div>
                      <span className="text-xs font-bold text-white">{g.name}</span>
                      <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-purple-300 font-semibold">
                        {g.count || 0} anime
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingGenreId(g.id);
                        setEditingGenreName(g.name);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-purple-300"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteGenre(g)}
                      className="p-1 rounded text-slate-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 5: SYNC & LOGS
         ======================================================== */}
      {activeTab === 'sync' && (
        <div className="space-y-6">
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  Jikan / MyAnimeList Data Synchronizer
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Fetch top rated and currently airing anime directly from the official Jikan REST API and upsert into Postgres/SQLite.
                </p>
              </div>

              <button
                onClick={handleTriggerSync}
                disabled={isSyncing}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Trigger Sync Now'}</span>
              </button>
            </div>

            {syncStatus && (
              <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/40 text-xs text-purple-200 animate-pulse flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
                <span>{syncStatus}</span>
              </div>
            )}
          </div>

          {/* Full Logs */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white">Full Sync Logs History</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Log ID</th>
                    <th className="py-3 px-4">Execution Time</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Items Synced</th>
                    <th className="py-3 px-4">Log Output / Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {syncLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-purple-950/20 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-400">#{log.id}</td>
                      <td className="py-3 px-4 text-slate-400">
                        {new Date(log.runAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            log.status === 'success'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-white">{log.itemsSynced || 0}</td>
                      <td className="py-3 px-4 text-slate-300">{log.message}</td>
                    </tr>
                  ))}
                  {syncLogs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">
                        No logs recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <AnimeModal
        isOpen={isAnimeModalOpen}
        onClose={() => {
          setIsAnimeModalOpen(false);
          setEditingAnime(null);
        }}
        onSave={handleSaveAnime}
        initialData={editingAnime}
        availableGenres={genres}
      />

      <EpisodeModal
        isOpen={isEpisodeModalOpen}
        onClose={() => {
          setIsEpisodeModalOpen(false);
          setEditingEpisode(null);
        }}
        onSave={handleSaveEpisode}
        initialData={editingEpisode}
        animeTitle={selectedAnimeObj?.titleEnglish || selectedAnimeObj?.title}
        suggestedNextEp={episodes.length + 1}
      />
    </PageTransition>
  );
}
