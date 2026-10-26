import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  FlaskConical,
  CheckCircle2,
  XCircle,
  Plus,
  RefreshCw,
  ExternalLink,
  Save,
  Globe,
  Play
} from 'lucide-react';

export default function AnalyticsTab({ settings, onSave, isSaving }) {
  const [analytics, setAnalytics] = useState(settings?.analytics || {});
  const [newExp, setNewExp] = useState({ name: '', variantA: '', variantB: '', split: '50/50', primaryMetric: '' });
  const [activeSubTab, setActiveSubTab] = useState('widgets'); // 'widgets' | 'ab_testing' | 'errors'

  const handleToggleExpStatus = (id) => {
    setAnalytics((prev) => ({
      ...prev,
      abExperiments: (prev.abExperiments || []).map((exp) => {
        if (exp.id === id) {
          const nextStatus = exp.status === 'Active' ? 'Paused' : exp.status === 'Paused' ? 'Concluded' : 'Active';
          return { ...exp, status: nextStatus };
        }
        return exp;
      })
    }));
  };

  const handleToggleResolveError = (id) => {
    setAnalytics((prev) => ({
      ...prev,
      errorAlerts: (prev.errorAlerts || []).map((err) =>
        err.id === id ? { ...err, status: err.status === 'Resolved' ? 'Open' : 'Resolved' } : err
      )
    }));
  };

  const handleAddExperiment = () => {
    if (!newExp.name.trim()) return;
    const exp = {
      id: 'exp_' + Date.now(),
      name: newExp.name.trim(),
      status: 'Active',
      split: newExp.split || '50/50',
      primaryMetric: newExp.primaryMetric.trim() || 'Watch Conversion Rate'
    };
    setAnalytics((prev) => ({
      ...prev,
      abExperiments: [...(prev.abExperiments || []), exp]
    }));
    setNewExp({ name: '', variantA: '', variantB: '', split: '50/50', primaryMetric: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ analytics });
  };

  const widgets = analytics.dashboardWidgets || {};
  const regionalData = widgets.topWatchedByRegion || [];
  const retention = widgets.retentionMetrics || {};
  const experiments = analytics.abExperiments || [];
  const errorAlerts = analytics.errorAlerts || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2.5">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            <span>Analytics, A/B Testing & Health Reporting</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Regional streaming distribution, viewer retention cohorts, experiment controls, and broken link alerts.
          </p>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Analytics Config'}</span>
        </button>
      </div>

      {/* Internal Subtabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        {[
          { id: 'widgets', label: 'Streaming & Retention Widgets', icon: TrendingUp },
          { id: 'ab_testing', label: 'A/B Test Controls', icon: FlaskConical },
          { id: 'errors', label: 'Error Logs & Alerts', icon: AlertTriangle }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUBTAB 1: STREAMING & RETENTION WIDGETS */}
      {activeSubTab === 'widgets' && (
        <div className="space-y-6">
          {/* Key Retention Cohorts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Episode 1 → 2 Retention
              </span>
              <p className="text-3xl font-black text-emerald-400 mt-2 font-mono">
                {retention.ep1ToEp2Retention || '79.2%'}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Users who continue past pilot episode</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Series Completion Rate
              </span>
              <p className="text-3xl font-black text-purple-400 mt-2 font-mono">
                {retention.seriesCompletionRate || '61.5%'}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Finished all season episodes</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Avg. Watch Session
              </span>
              <p className="text-3xl font-black text-cyan-400 mt-2 font-mono">
                {retention.averageSessionMinutes || '28.4 min'}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Sustained streaming duration per visit</p>
            </div>
          </div>

          {/* Regional Watch Distribution */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Top-Watched Anime by Region</span>
            </h3>

            <div className="space-y-4 pt-2">
              {regionalData.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{item.region}</span>
                    <span className="text-slate-400 font-mono">
                      {item.views} views ({item.percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        idx === 0
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-500'
                          : idx === 1
                          ? 'bg-gradient-to-r from-cyan-400 to-blue-500'
                          : idx === 2
                          ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                          : 'bg-gradient-to-r from-amber-400 to-orange-500'
                      }`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: A/B TEST EXPERIMENT CONTROLS */}
      {activeSubTab === 'ab_testing' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-purple-400" />
                  <span>A/B Experiment Matrix</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Launch live experiments on discovery card thumbnails, hero banners, and recommendation models.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {experiments.map((exp) => (
                <div
                  key={exp.id}
                  className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">{exp.name}</h4>
                    <button
                      type="button"
                      onClick={() => handleToggleExpStatus(exp.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        exp.status === 'Active'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : exp.status === 'Paused'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-slate-700 text-slate-400 border border-slate-600'
                      }`}
                    >
                      {exp.status} (Click to toggle)
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Traffic Split: <strong className="text-white font-mono">{exp.split}</strong></span>
                    <span>Metric: <strong className="text-purple-300">{exp.primaryMetric}</strong></span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-center">
                      <span className="text-slate-400 block font-bold">Variant A (Control)</span>
                      <span className="text-slate-300 font-mono">50% Traffic</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-center">
                      <span className="text-purple-300 block font-bold">Variant B (Challenger)</span>
                      <span className="text-purple-200 font-mono">50% Traffic</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Create Experiment */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row gap-3 items-center">
              <input
                type="text"
                placeholder="Experiment Name (e.g. Modern Glass Cards)"
                value={newExp.name}
                onChange={(e) => setNewExp({ ...newExp, name: e.target.value })}
                className="flex-1 w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <input
                type="text"
                placeholder="Primary Metric (e.g. Watch Time)"
                value={newExp.primaryMetric}
                onChange={(e) => setNewExp({ ...newExp, primaryMetric: e.target.value })}
                className="flex-1 w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none"
              />
              <select
                value={newExp.split}
                onChange={(e) => setNewExp({ ...newExp, split: e.target.value })}
                className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none"
              >
                <option value="50/50">50 / 50 Split</option>
                <option value="70/30">70 / 30 Split</option>
                <option value="90/10">90 / 10 Canary</option>
              </select>
              <button
                type="button"
                onClick={handleAddExperiment}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Launch Experiment</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: ERROR LOGS & ALERTS */}
      {activeSubTab === 'errors' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Media Health & Error Alert Feed</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Error Type</th>
                    <th className="py-3 px-4">Target Anime / Resource</th>
                    <th className="py-3 px-4">Error Code</th>
                    <th className="py-3 px-4">Logged Time</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {errorAlerts.map((err) => (
                    <tr key={err.id} className="hover:bg-purple-950/10">
                      <td className="py-3 px-4 font-bold text-rose-300">{err.type}</td>
                      <td className="py-3 px-4 font-semibold text-white">{err.target}</td>
                      <td className="py-3 px-4 font-mono text-slate-400">{err.code}</td>
                      <td className="py-3 px-4 text-slate-400">{err.date}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            err.status === 'Resolved'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {err.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggleResolveError(err.id)}
                          className="text-xs text-purple-400 hover:text-purple-300 underline font-semibold"
                        >
                          {err.status === 'Resolved' ? 'Mark Open' : 'Mark Resolved'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
