import React, { useState } from 'react';
import {
  Palette,
  Sparkles,
  Moon,
  Sun,
  LayoutGrid,
  Layers,
  Save,
  CheckCircle2,
  Sliders,
  Eye
} from 'lucide-react';
import SkeletonCard from '../../common/SkeletonCard';

export default function UiPolishTab({ settings, onSave, isSaving }) {
  const [uiPolish, setUiPolish] = useState(settings?.uiPolish || {});
  const [previewSkeleton, setPreviewSkeleton] = useState(false);

  const handleToggle = (key) => {
    setUiPolish((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleChange = (key, value) => {
    setUiPolish((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ uiPolish });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2.5">
            <Palette className="w-5 h-5 text-purple-400" />
            <span>Anime-Style UI/UX Polish Controls</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Fine-tune buttery smooth carousel scrolling, micro-animation sparkles, dark mode, responsive grid breakpoints, and skeleton shimmer loaders.
          </p>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save UI Polish Settings'}</span>
        </button>
      </div>

      {/* Grid of UI / UX Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Toggle 1: Smooth Scrolling & Snap Points */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Smooth Carousel Scrolling & Snap-Points</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enables buttery <code className="text-purple-300">scroll-behavior: smooth</code> and CSS <code className="text-purple-300">snap-type: x mandatory</code> on the trending and recommendation sliders.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-1">
            <input
              type="checkbox"
              checked={uiPolish.smoothScroll !== false}
              onChange={() => handleToggle('smoothScroll')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {/* Toggle 2: Micro-Animations Sparkles */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Anime Sparkle Micro-Animations</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Subtle GPU-accelerated CSS hover scale-up and sparkle ✨ particles on poster covers without heavy JavaScript overhead.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-1">
            <input
              type="checkbox"
              checked={uiPolish.microAnimationsSparkle !== false}
              onChange={() => handleToggle('microAnimationsSparkle')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {/* Toggle 3: Dark Mode Theme */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Moon className="w-4 h-4 text-cyan-400" />
              <span>Default Deep Otaku Night Mode</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Reduces eye strain for late-night anime binges with custom <code className="text-cyan-300">#0b0f19</code> obsidian backdrop and reduced blue light emissions.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-1">
            <input
              type="checkbox"
              checked={uiPolish.darkModeDefault !== false}
              onChange={() => handleToggle('darkModeDefault')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {/* Toggle 4: High-Contrast Accessibility Theme */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>High-Contrast Mode Option</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Elevates typography contrast borders and subtitle outlines to satisfy WCAG AAA visual accessibility standards.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-1">
            <input
              type="checkbox"
              checked={uiPolish.highContrastMode === true}
              onChange={() => handleToggle('highContrastMode')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>
      </div>

      {/* Responsive Grid System Breakpoints */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-emerald-400" />
          <span>Responsive Layout Grid Configuration</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
            <span className="text-xs font-bold text-slate-300 block mb-1">Desktop Breakpoint</span>
            <span className="text-2xl font-black text-purple-400 font-mono">
              {uiPolish.desktopGridCols || 4} Columns
            </span>
            <p className="text-[11px] text-slate-500 mt-1">CSS Grid: grid-cols-4 (≥1024px)</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
            <span className="text-xs font-bold text-slate-300 block mb-1">Tablet Breakpoint</span>
            <span className="text-2xl font-black text-cyan-400 font-mono">
              {uiPolish.tabletGridCols || 2} Columns
            </span>
            <p className="text-[11px] text-slate-500 mt-1">CSS Grid: grid-cols-2 (640px - 1023px)</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
            <span className="text-xs font-bold text-slate-300 block mb-1">Mobile Breakpoint</span>
            <span className="text-2xl font-black text-amber-400 font-mono">
              {uiPolish.mobileGridCols || 1} Column
            </span>
            <p className="text-[11px] text-slate-500 mt-1">CSS Grid: grid-cols-1 (&lt;640px)</p>
          </div>
        </div>
      </div>

      {/* Skeleton Loaders Preview & Calibration */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Skeleton Placeholder Shimmer Simulator</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Test shimmering skeleton placeholders so users never experience layout shifts or blank screens during data fetching.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setPreviewSkeleton(!previewSkeleton)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-purple-400" />
            <span>{previewSkeleton ? 'Hide Skeleton Preview' : 'Preview Shimmer Skeletons'}</span>
          </button>
        </div>

        {previewSkeleton && (
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
              Live Shimmer Skeleton Grid (4 cards):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
