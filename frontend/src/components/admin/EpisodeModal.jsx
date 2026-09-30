import React, { useState, useEffect } from 'react';
import { X, Tv, AlertCircle } from 'lucide-react';

export default function EpisodeModal({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  animeTitle = '',
  suggestedNextEp = 1,
}) {
  const [formData, setFormData] = useState({
    episodeNumber: suggestedNextEp,
    title: '',
    titleJapanese: '',
    duration: 24,
    streamUrl: '',
    thumbnailUrl: '',
    synopsis: '',
    isFiller: false,
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        episodeNumber: initialData.episodeNumber || 1,
        title: initialData.title || '',
        titleJapanese: initialData.titleJapanese || '',
        duration: initialData.duration || 24,
        streamUrl: initialData.streamUrl || '',
        thumbnailUrl: initialData.thumbnailUrl || '',
        synopsis: initialData.synopsis || '',
        isFiller: Boolean(initialData.isFiller),
      });
    } else {
      setFormData({
        episodeNumber: suggestedNextEp || 1,
        title: `Episode ${suggestedNextEp || 1}`,
        titleJapanese: '',
        duration: 24,
        streamUrl: '',
        thumbnailUrl: '',
        synopsis: '',
        isFiller: false,
      });
    }
    setError('');
  }, [initialData, suggestedNextEp, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Episode title is required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error('Failed to save episode:', err);
      setError(err.response?.data?.message || err.message || 'Failed to save episode');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden z-10 my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Tv className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {initialData ? `Edit Episode ${initialData.episodeNumber}` : 'Add New Episode'}
              </h3>
              {animeTitle && (
                <p className="text-xs text-purple-300 truncate max-w-xs">{animeTitle}</p>
              )}
            </div>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Episode Number <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                disabled={!!initialData}
                value={formData.episodeNumber}
                onChange={(e) => handleChange('episodeNumber', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Duration (min)</label>
              <input
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) => handleChange('duration', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Episode Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g. The Journey's End"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Video Stream / Embed URL
            </label>
            <input
              type="url"
              value={formData.streamUrl}
              onChange={(e) => handleChange('streamUrl', e.target.value)}
              placeholder="https://www.youtube.com/embed/... or direct stream link"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Scene Thumbnail URL
            </label>
            <input
              type="url"
              value={formData.thumbnailUrl}
              onChange={(e) => handleChange('thumbnailUrl', e.target.value)}
              placeholder="https://... (Scene or poster image)"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Episode Synopsis</label>
            <textarea
              rows={2}
              value={formData.synopsis}
              onChange={(e) => handleChange('synopsis', e.target.value)}
              placeholder="Brief summary of events in this episode..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.isFiller}
                onChange={(e) => handleChange('isFiller', e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 bg-slate-800 border-slate-700 focus:ring-purple-500"
              />
              <span>Mark as filler episode</span>
            </label>
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
              {isSubmitting ? 'Saving...' : initialData ? 'Update Episode' : 'Add Episode'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
