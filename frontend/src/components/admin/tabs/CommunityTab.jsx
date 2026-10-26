import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  Star,
  Award,
  Shield,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Crown,
  Zap,
  Save,
  Megaphone
} from 'lucide-react';

export default function CommunityTab({ settings, onSave, isSaving }) {
  const [community, setCommunity] = useState(settings?.community || {});
  const [newBadge, setNewBadge] = useState({ name: '', color: 'from-purple-500 to-indigo-500', icon: 'Sparkles', desc: '' });
  const [newRule, setNewRule] = useState('');

  const handleChange = (key, value) => {
    setCommunity((prev) => ({ ...prev, [key]: value }));
  };

  const handleBannerChange = (key, value) => {
    setCommunity((prev) => ({
      ...prev,
      announcementBanner: { ...prev.announcementBanner, [key]: value }
    }));
  };

  const handleRatingWeightChange = (starWeight) => {
    const star = Math.max(0, Math.min(100, Number(starWeight)));
    setCommunity((prev) => ({
      ...prev,
      starScoreWeight: star,
      writtenReviewWeight: 100 - star
    }));
  };

  const handleAddBadge = () => {
    if (!newBadge.name.trim()) return;
    const badge = {
      id: 'badge_' + Date.now(),
      name: newBadge.name.trim(),
      color: newBadge.color,
      icon: newBadge.icon,
      desc: newBadge.desc.trim() || 'Custom community badge'
    };
    setCommunity((prev) => ({
      ...prev,
      badges: [...(prev.badges || []), badge]
    }));
    setNewBadge({ name: '', color: 'from-purple-500 to-indigo-500', icon: 'Sparkles', desc: '' });
  };

  const handleRemoveBadge = (id) => {
    setCommunity((prev) => ({
      ...prev,
      badges: (prev.badges || []).filter((b) => b.id !== id)
    }));
  };

  const handleAddRule = () => {
    if (!newRule.trim()) return;
    setCommunity((prev) => ({
      ...prev,
      moderationRules: [...(prev.moderationRules || []), newRule.trim()]
    }));
    setNewRule('');
  };

  const handleRemoveRule = (index) => {
    setCommunity((prev) => ({
      ...prev,
      moderationRules: (prev.moderationRules || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ community });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn">
      {/* Header bar with save button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2.5">
            <Users className="w-5 h-5 text-purple-400" />
            <span>Community & Social Features</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage user profile parameters, review moderation policies, rating weight algorithms, and Discord/announcement integration.
          </p>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Community Settings'}</span>
        </button>
      </div>

      {/* Section 1: User Profiles & Badges */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span>User Profiles & Badges Configuration</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Bio Character Limit ({community.bioMaxLength || 350} chars)
            </label>
            <input
              type="range"
              min="100"
              max="800"
              step="25"
              value={community.bioMaxLength || 350}
              onChange={(e) => handleChange('bioMaxLength', parseInt(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>Short (100)</span>
              <span>Default (350)</span>
              <span>Long (800)</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Max Favorite Anime on Profile ({community.favoriteAnimeLimit || 10} titles)
            </label>
            <input
              type="number"
              min="3"
              max="30"
              value={community.favoriteAnimeLimit || 10}
              onChange={(e) => handleChange('favoriteAnimeLimit', parseInt(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Badges List & Creator */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-semibold text-slate-300">
            Profile Badges & Flairs ({community.badges?.length || 0})
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {(community.badges || []).map((badge) => (
              <div
                key={badge.id}
                className="relative p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-extrabold text-white bg-gradient-to-r ${badge.color}`}>
                      <Sparkles className="w-3 h-3" />
                      {badge.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveBadge(badge.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Add Badge */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row gap-3 items-center">
            <input
              type="text"
              placeholder="Badge Title (e.g., Manga Scholar)"
              value={newBadge.name}
              onChange={(e) => setNewBadge({ ...newBadge, name: e.target.value })}
              className="flex-1 w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <input
              type="text"
              placeholder="Description"
              value={newBadge.desc}
              onChange={(e) => setNewBadge({ ...newBadge, desc: e.target.value })}
              className="flex-1 w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <select
              value={newBadge.color}
              onChange={(e) => setNewBadge({ ...newBadge, color: e.target.value })}
              className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none"
            >
              <option value="from-purple-500 to-indigo-500">Purple / Indigo</option>
              <option value="from-amber-400 to-orange-500">Gold / Amber</option>
              <option value="from-emerald-400 to-teal-600">Emerald / Teal</option>
              <option value="from-rose-500 to-pink-600">Rose / Pink</option>
              <option value="from-cyan-400 to-blue-600">Cyan / Blue</option>
            </select>
            <button
              type="button"
              onClick={handleAddBadge}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-bold text-white flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Badge</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section 2: Comments & Reviews Moderation */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          <span>Comments & Reviews Moderation</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Comment Approval Policy
            </label>
            <select
              value={community.commentsModeration || 'auto'}
              onChange={(e) => handleChange('commentsModeration', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="auto">Auto-Approve (AI & Keyword Spam Filter Active)</option>
              <option value="require_approval">Require Admin Review before Public Display</option>
              <option value="strict">Strict Mode (Restricted to Accounts 7+ days old)</option>
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              Automated filters detect hate speech and unauthorized external links.
            </p>
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <div>
                <span className="text-xs font-semibold text-white">Default "Spoiler-Hide" Toggle</span>
                <p className="text-[11px] text-slate-400">Blur marked spoilers until explicitly clicked by reader</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={community.spoilerHideToggle !== false}
                  onChange={(e) => handleChange('spoilerHideToggle', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Ratings Algorithm System */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-400" />
          <span>Ratings System & Composite Score Weights</span>
        </h3>

        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-slate-200">
              Star Scores vs. Written Reviews Balance:
            </span>
            <span className="font-bold text-purple-400 font-mono">
              ⭐ Star Rating: {community.starScoreWeight || 65}% &nbsp;|&nbsp; 📝 Written Review: {community.writtenReviewWeight || 35}%
            </span>
          </div>

          <input
            type="range"
            min="10"
            max="90"
            step="5"
            value={community.starScoreWeight || 65}
            onChange={(e) => handleRatingWeightChange(e.target.value)}
            className="w-full accent-purple-500 cursor-pointer"
          />

          <div className="grid grid-cols-2 gap-4 text-[11px] text-slate-400">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-white font-bold block mb-0.5">Star Score ({community.starScoreWeight || 65}%)</span>
              High weight prevents review bombing and rewards widespread popularity.
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-white font-bold block mb-0.5">Written Reviews ({community.writtenReviewWeight || 35}%)</span>
              Rewards in-depth community analysis and verified watching history.
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Forums, Discord & In-App Announcement Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-emerald-400" />
          <span>Forums, Discord & In-App Announcements</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Official Discord Invite URL
            </label>
            <input
              type="url"
              value={community.discordUrl || ''}
              onChange={(e) => handleChange('discordUrl', e.target.value)}
              placeholder="https://discord.gg/..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Community Forums / Discussions Link
            </label>
            <input
              type="url"
              value={community.forumUrl || ''}
              onChange={(e) => handleChange('forumUrl', e.target.value)}
              placeholder="https://community.anipulse.io"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono"
            />
          </div>
        </div>

        {/* In-App Announcement Banner Box */}
        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-white">Live In-App Announcement Banner</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={community.announcementBanner?.enabled !== false}
                onChange={(e) => handleBannerChange('enabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-3">
              <input
                type="text"
                value={community.announcementBanner?.text || ''}
                onChange={(e) => handleBannerChange('text', e.target.value)}
                placeholder="Banner copy (e.g. 🎉 Fall 2026 Season is now streaming in 1080p!)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <div>
              <select
                value={community.announcementBanner?.type || 'promo'}
                onChange={(e) => handleBannerChange('type', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none"
              >
                <option value="promo">Promo (Purple)</option>
                <option value="info">Info (Cyan)</option>
                <option value="warning">Warning (Amber)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Community Moderation Guidelines */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-300">
            Community Rules & Moderation Guidelines
          </label>
          <div className="space-y-2">
            {(community.moderationRules || []).map((rule, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
                <span className="flex-1 pr-3">
                  <span className="font-bold text-purple-400 mr-2">#{idx + 1}</span>
                  {rule}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveRule(idx)}
                  className="text-slate-400 hover:text-rose-400 p-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add new rule or moderation policy..."
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <button
              type="button"
              onClick={handleAddRule}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-bold text-white flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
