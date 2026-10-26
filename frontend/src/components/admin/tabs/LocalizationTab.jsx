import React, { useState } from 'react';
import {
  Globe,
  Sliders,
  Type,
  Plus,
  Trash2,
  CheckCircle2,
  Save,
  Languages,
  Eye,
  Volume2
} from 'lucide-react';

export default function LocalizationTab({ settings, onSave, isSaving }) {
  const [localization, setLocalization] = useState(settings?.localization || {});
  const [newTag, setNewTag] = useState('');
  const [newLang, setNewLang] = useState({ code: '', name: '', nativeName: '', progress: 50 });

  const handleLanguageProgressChange = (code, progress) => {
    setLocalization((prev) => ({
      ...prev,
      languages: (prev.languages || []).map((l) =>
        l.code === code ? { ...l, progress: parseInt(progress) } : l
      )
    }));
  };

  const handleSetDefaultLang = (code) => {
    setLocalization((prev) => ({
      ...prev,
      languages: (prev.languages || []).map((l) => ({
        ...l,
        default: l.code === code
      }))
    }));
  };

  const handleAddLanguage = () => {
    if (!newLang.code.trim() || !newLang.name.trim()) return;
    setLocalization((prev) => ({
      ...prev,
      languages: [
        ...(prev.languages || []),
        {
          code: newLang.code.toLowerCase().trim(),
          name: newLang.name.trim(),
          nativeName: newLang.nativeName.trim() || newLang.name.trim(),
          progress: Number(newLang.progress) || 50,
          default: false
        }
      ]
    }));
    setNewLang({ code: '', name: '', nativeName: '', progress: 50 });
  };

  const handleRemoveLanguage = (code) => {
    setLocalization((prev) => ({
      ...prev,
      languages: (prev.languages || []).filter((l) => l.code !== code)
    }));
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    setLocalization((prev) => ({
      ...prev,
      subtitleDubQualityTags: [...(prev.subtitleDubQualityTags || []), newTag.trim()]
    }));
    setNewTag('');
  };

  const handleRemoveTag = (tag) => {
    setLocalization((prev) => ({
      ...prev,
      subtitleDubQualityTags: (prev.subtitleDubQualityTags || []).filter((t) => t !== tag)
    }));
  };

  const handleA11yChange = (key, value) => {
    setLocalization((prev) => ({
      ...prev,
      accessibility: {
        ...(prev.accessibility || {}),
        [key]: value
      }
    }));
  };

  const handleCcChange = (key, value) => {
    setLocalization((prev) => ({
      ...prev,
      accessibility: {
        ...(prev.accessibility || {}),
        closedCaptionStyling: {
          ...(prev.accessibility?.closedCaptionStyling || {}),
          [key]: value
        }
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ localization });
  };

  const cc = localization.accessibility?.closedCaptionStyling || {};

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-cyan-400" />
            <span>Localization & Accessibility Options</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Language translation packs, subtitle and dubbing quality tagging, and player accessibility controls.
          </p>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Localization Settings'}</span>
        </button>
      </div>

      {/* Language Packs */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Languages className="w-4 h-4 text-purple-400" />
          <span>Active UI Language Packs & Coverage</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Language</th>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Native Name</th>
                <th className="py-3 px-4">Coverage</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {(localization.languages || []).map((lang) => (
                <tr key={lang.code} className="hover:bg-purple-950/10">
                  <td className="py-3 px-4 font-bold text-white">{lang.name}</td>
                  <td className="py-3 px-4 font-mono text-purple-300 uppercase">{lang.code}</td>
                  <td className="py-3 px-4 text-slate-400">{lang.nativeName}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full rounded-full"
                          style={{ width: `${lang.progress}%` }}
                        />
                      </div>
                      <span className="font-mono text-[11px] text-slate-400">{lang.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {lang.default ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        Default
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetDefaultLang(lang.code)}
                        className="text-[11px] text-slate-400 hover:text-white underline"
                      >
                        Set Default
                      </button>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {!lang.default && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLanguage(lang.code)}
                        className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Language Form */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row gap-3 items-center">
          <input
            type="text"
            placeholder="Language Name (e.g. Italian)"
            value={newLang.name}
            onChange={(e) => setNewLang({ ...newLang, name: e.target.value })}
            className="flex-1 w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
          <input
            type="text"
            placeholder="ISO Code (e.g. it)"
            value={newLang.code}
            onChange={(e) => setNewLang({ ...newLang, code: e.target.value })}
            className="w-24 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none font-mono uppercase"
          />
          <input
            type="text"
            placeholder="Native Name (Italiano)"
            value={newLang.nativeName}
            onChange={(e) => setNewLang({ ...newLang, nativeName: e.target.value })}
            className="flex-1 w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddLanguage}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-bold text-white flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Language</span>
          </button>
        </div>
      </div>

      {/* Subtitle & Dub Quality Tags */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Type className="w-4 h-4 text-emerald-400" />
          <span>Subtitle & Dub Quality Tag Badges</span>
        </h3>

        <div className="flex flex-wrap gap-2.5">
          {(localization.subtitleDubQualityTags || []).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-slate-500 hover:text-rose-400 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-2 max-w-md">
          <input
            type="text"
            placeholder="Add quality tag (e.g. 4K Ultra-HD, Soft-sub)..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-bold text-white flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Tag</span>
          </button>
        </div>
      </div>

      {/* Accessibility Options */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Eye className="w-4 h-4 text-amber-400" />
          <span>Player Accessibility & Closed-Caption Styling</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Default Closed-Caption Size
            </label>
            <select
              value={cc.fontSize || 'Medium (18px)'}
              onChange={(e) => handleCcChange('fontSize', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none"
            >
              <option value="Small (14px)">Small (14px)</option>
              <option value="Medium (18px)">Medium (18px) - Recommended</option>
              <option value="Large (22px)">Large (22px)</option>
              <option value="Extra Large (28px)">Extra Large (28px)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Text Contrast Color
            </label>
            <select
              value={cc.textColor || '#FFFFFF'}
              onChange={(e) => handleCcChange('textColor', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none"
            >
              <option value="#FFFFFF">Pure White (#FFFFFF)</option>
              <option value="#FFFF00">High-Contrast Yellow (#FFFF00)</option>
              <option value="#00FFFF">Cyan (#00FFFF)</option>
            </select>
          </div>

          <div className="flex flex-col justify-center space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <div>
                <span className="text-xs font-semibold text-white">Audio Description Flag</span>
                <p className="text-[11px] text-slate-400">Mark episodes featuring narrative audio tracks</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localization.accessibility?.audioDescriptionFlags !== false}
                  onChange={(e) => handleA11yChange('audioDescriptionFlags', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Live CC Preview Box */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 relative overflow-hidden flex flex-col items-center justify-center min-h-[120px]">
          <div className="absolute top-2 left-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Subtitle Live Preview
          </div>
          <p
            className="px-4 py-1.5 rounded"
            style={{
              color: cc.textColor || '#FFFFFF',
              backgroundColor: cc.backgroundColor || 'rgba(0,0,0,0.75)',
              fontSize: cc.fontSize?.includes('Large') ? '1.25rem' : '1rem',
              textShadow: '0 2px 4px rgba(0,0,0,0.8)'
            }}
          >
            "Even if I die, I'll keep pushing forward!" — Shounen Protagonist
          </p>
        </div>
      </div>
    </form>
  );
}
