import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react';

const COMMON_GENRES = [
  'Action', 'Adventure', 'Award Winning', 'Comedy', 'Drama',
  'Fantasy', 'Historical', 'Horror', 'Mystery', 'Romance',
  'Sci-Fi', 'Slice of Life', 'Supernatural', 'Suspense'
];

export default function AnimeModal({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  availableGenres = [],
}) {
  const [formData, setFormData] = useState({
    title: '',
    titleEnglish: '',
    type: 'TV',
    status: 'Completed',
    score: '',
    episodes: '',
    imageUrl: '',
    trailerUrl: '',
    synopsis: '',
    genres: [],
  });
  const [customGenre, setCustomGenre] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        titleEnglish: initialData.titleEnglish || '',
        type: initialData.type || 'TV',
        status: initialData.status || 'Completed',
        score: initialData.score !== null && initialData.score !== undefined ? initialData.score.toString() : '',
        episodes: initialData.episodes !== null && initialData.episodes !== undefined ? initialData.episodes.toString() : '',
        imageUrl: initialData.imageUrl || '',
        trailerUrl: initialData.trailerUrl || '',
        synopsis: initialData.synopsis || '',
        genres: Array.isArray(initialData.genres) ? [...initialData.genres] : [],
      });
    } else {
      setFormData({
        title: '',
        titleEnglish: '',
        type: 'TV',
        status: 'Completed',
        score: '',
        episodes: '',
        imageUrl: '',
        trailerUrl: '',
        synopsis: '',
        genres: ['Action', 'Fantasy'],
      });
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleGenre = (genre) => {
    setFormData((prev) => {
      const exists = prev.genres.includes(genre);
      return {
        ...prev,
        genres: exists ? prev.genres.filter((g) => g !== genre) : [...prev.genres, genre],
      };
    });
  };

  const handleAddCustomGenre = (e) => {
    e.preventDefault();
    if (customGenre.trim() && !formData.genres.includes(customGenre.trim())) {
      setFormData((prev) => ({ ...prev, genres: [...prev.genres, customGenre.trim()] }));
      setCustomGenre('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Anime title is required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error('Failed to save anime:', err);
      setError(err.response?.data?.message || err.message || 'Failed to save anime');
    } finally {
      setIsSubmitting(false);
    }
  };

  const allGenreOptions = Array.from(
    new Set([
      ...COMMON_GENRES,
      ...availableGenres.map((g) => (typeof g === 'string' ? g : g.name)),
    ])
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden z-10 my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-white">
              {initialData ? 'Edit Anime Details' : 'Add New Anime to Catalog'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Main Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Title (Japanese / Romaji) <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g. Sousou no Frieren"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* English Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              English Title
            </label>
            <input
              type="text"
              value={formData.titleEnglish}
              onChange={(e) => handleChange('titleEnglish', e.target.value)}
              placeholder="e.g. Frieren: Beyond Journey's End"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Row: Format, Status, Score, Episodes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Format</label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="TV">TV</option>
                <option value="Movie">Movie</option>
                <option value="ONA">ONA</option>
                <option value="OVA">OVA</option>
                <option value="Special">Special</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="Airing">Airing</option>
                <option value="Completed">Completed</option>
                <option value="Upcoming">Upcoming</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Score (0-10)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={formData.score}
                onChange={(e) => handleChange('score', e.target.value)}
                placeholder="9.10"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Episodes</label>
              <input
                type="number"
                min="1"
                value={formData.episodes}
                onChange={(e) => handleChange('episodes', e.target.value)}
                placeholder="24"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Image URL with live preview */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Poster Image URL
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => handleChange('imageUrl', e.target.value)}
                placeholder="https://... (Direct poster image link)"
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {formData.imageUrl && (
                <div className="w-10 h-14 rounded-lg overflow-hidden bg-slate-800 border border-slate-700 flex-shrink-0">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Trailer URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Trailer Video URL (YouTube Embed or Link)
            </label>
            <input
              type="url"
              value={formData.trailerUrl}
              onChange={(e) => handleChange('trailerUrl', e.target.value)}
              placeholder="https://www.youtube.com/embed/... or watch?v=..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Synopsis */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Synopsis</label>
            <textarea
              rows={3}
              value={formData.synopsis}
              onChange={(e) => handleChange('synopsis', e.target.value)}
              placeholder="Anime plot synopsis, background, and themes..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Genre selector tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Genres & Themes ({formData.genres.length} selected)
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2 max-h-28 overflow-y-auto p-1 bg-slate-950/40 rounded-xl border border-slate-800">
              {allGenreOptions.map((g) => {
                const isSelected = formData.genres.includes(g);
                return (
                  <button
                    type="button"
                    key={g}
                    onClick={() => toggleGenre(g)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {g} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>

            {/* Add custom genre field */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customGenre}
                onChange={(e) => setCustomGenre(e.target.value)}
                placeholder="Or type custom genre tag..."
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={handleAddCustomGenre}
                className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-white"
              >
                Add
              </button>
            </div>
          </div>

          {/* Modal Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : initialData ? 'Update Anime' : 'Create Anime'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
