import React, { useState } from 'react';
import {
  Cpu,
  Server,
  Database,
  Gauge,
  RefreshCw,
  Save,
  CheckCircle2,
  Trash2,
  Plus,
  ShieldAlert
} from 'lucide-react';

export default function TechnicalTab({ settings, onSave, isSaving }) {
  const [technical, setTechnical] = useState(settings?.technical || {});
  const [purgeStatus, setPurgeStatus] = useState(null);
  const [newNode, setNewNode] = useState('');

  const handleCachingChange = (field, value) => {
    setTechnical((prev) => ({
      ...prev,
      cachingRules: { ...(prev.cachingRules || {}), [field]: value }
    }));
  };

  const handleCdnChange = (field, value) => {
    setTechnical((prev) => ({
      ...prev,
      cdnEndpoints: { ...(prev.cdnEndpoints || {}), [field]: value }
    }));
  };

  const handleRateLimitChange = (field, value) => {
    setTechnical((prev) => ({
      ...prev,
      rateLimits: { ...(prev.rateLimits || {}), [field]: parseInt(value) || 0 }
    }));
  };

  const handleAddNode = () => {
    if (!newNode.trim()) return;
    setTechnical((prev) => ({
      ...prev,
      cdnEndpoints: {
        ...(prev.cdnEndpoints || {}),
        regionalNodes: [...(prev.cdnEndpoints?.regionalNodes || []), newNode.trim()]
      }
    }));
    setNewNode('');
  };

  const handleRemoveNode = (node) => {
    setTechnical((prev) => ({
      ...prev,
      cdnEndpoints: {
        ...(prev.cdnEndpoints || {}),
        regionalNodes: (prev.cdnEndpoints?.regionalNodes || []).filter((n) => n !== node)
      }
    }));
  };

  const handlePurgeCache = () => {
    setPurgeStatus('Purging edge nodes...');
    setTimeout(() => {
      setPurgeStatus('Edge CDN and in-memory caches successfully purged!');
      setTimeout(() => setPurgeStatus(null), 3500);
    }, 1200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ technical });
  };

  const cache = technical.cachingRules || {};
  const cdn = technical.cdnEndpoints || {};
  const rates = technical.rateLimits || {};

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <span>Technical Infrastructure & CDN Settings</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Fine-tune edge caching TTLs, video CDN endpoints, regional acceleration nodes, and third-party API rate limits.
          </p>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Technical Settings'}</span>
        </button>
      </div>

      {purgeStatus && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{purgeStatus}</span>
        </div>
      )}

      {/* Caching Rules */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-400" />
            <span>Edge Caching & Static Asset Rules</span>
          </h3>
          <button
            type="button"
            onClick={handlePurgeCache}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-xs font-semibold text-rose-300 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Purge CDN & Static Caches</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Anime Cover & Thumbnail TTL: <span className="text-purple-400 font-mono">{cache.coverThumbnailsTtlHours || 168} Hours ({(cache.coverThumbnailsTtlHours || 168) / 24} Days)</span>
            </label>
            <input
              type="range"
              min="24"
              max="720"
              step="24"
              value={cache.coverThumbnailsTtlHours || 168}
              onChange={(e) => handleCachingChange('coverThumbnailsTtlHours', parseInt(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              API Search & Filter Response TTL: <span className="text-cyan-400 font-mono">{cache.apiResponsesTtlMinutes || 15} Minutes</span>
            </label>
            <input
              type="range"
              min="1"
              max="60"
              step="1"
              value={cache.apiResponsesTtlMinutes || 15}
              onChange={(e) => handleCachingChange('apiResponsesTtlMinutes', parseInt(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
            <div>
              <span className="text-xs font-semibold text-white">Stale-While-Revalidate</span>
              <p className="text-[11px] text-slate-400">Serve stale cache instantly while background fetching updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={cache.staleWhileRevalidate !== false}
                onChange={(e) => handleCachingChange('staleWhileRevalidate', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
            <div>
              <span className="text-xs font-semibold text-white">Auto-Purge on Jikan Sync</span>
              <p className="text-[11px] text-slate-400">Invalidate catalog caches whenever cron sync finishes</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={cache.purgeCacheOnSync !== false}
                onChange={(e) => handleCachingChange('purgeCacheOnSync', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* CDN Endpoints */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Server className="w-4 h-4 text-cyan-400" />
          <span>CDN Provider & Streaming Distribution Nodes</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Primary CDN Provider
            </label>
            <select
              value={cdn.primaryProvider || 'Cloudflare Enterprise Edge'}
              onChange={(e) => handleCdnChange('primaryProvider', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none"
            >
              <option value="Cloudflare Enterprise Edge">Cloudflare Enterprise Edge</option>
              <option value="Fastly Global Real-Time CDN">Fastly Global Real-Time CDN</option>
              <option value="Amazon CloudFront Edge">Amazon CloudFront Edge</option>
              <option value="BunnyCDN Anycast">BunnyCDN Anycast</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Storage Bucket Endpoint
            </label>
            <input
              type="text"
              value={cdn.storageBucketUri || 'https://cdn.anipulse.media/anime-vault-v1'}
              onChange={(e) => handleCdnChange('storageBucketUri', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* Regional Nodes */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-300">
            Active Regional Acceleration Nodes (PoPs)
          </label>
          <div className="flex flex-wrap gap-2.5">
            {(cdn.regionalNodes || []).map((node) => (
              <span
                key={node}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{node}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveNode(node)}
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
              placeholder="Add regional node (e.g. London LHR-01)..."
              value={newNode}
              onChange={(e) => setNewNode(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <button
              type="button"
              onClick={handleAddNode}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-bold text-white flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Node</span>
            </button>
          </div>
        </div>
      </div>

      {/* API Rate Limits */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Gauge className="w-4 h-4 text-amber-400" />
          <span>API Rate Limits & Concurrent Playback Controls</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Jikan / MAL Sync Limits (Req / Min)
            </label>
            <input
              type="number"
              min="5"
              max="60"
              value={rates.jikanApiSyncPerMinute || 30}
              onChange={(e) => handleRateLimitChange('jikanApiSyncPerMinute', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-1">Safeguards from MyAnimeList HTTP 429 penalties</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Public Search Limit (Req / Min / IP)
            </label>
            <input
              type="number"
              min="20"
              max="300"
              value={rates.publicApiSearchPerMinute || 60}
              onChange={(e) => handleRateLimitChange('publicApiSearchPerMinute', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-1">Protects database from automated scrapers</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Concurrent Stream Sessions Per Account
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={rates.streamPlaybackConcurrentSessions || 3}
              onChange={(e) => handleRateLimitChange('streamPlaybackConcurrentSessions', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-1">Prevents credential sharing and bandwidth abuse</p>
          </div>
        </div>
      </div>
    </form>
  );
}
