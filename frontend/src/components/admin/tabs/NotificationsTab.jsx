import React, { useState } from 'react';
import {
  Bell,
  Mail,
  Send,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Clock,
  Tv,
  Users
} from 'lucide-react';

export default function NotificationsTab({ settings, onSave, isSaving }) {
  const [notifications, setNotifications] = useState(settings?.notifications || {});
  const [testSentStatus, setTestSentStatus] = useState(null);

  const handleTemplateChange = (id, field, value) => {
    setNotifications((prev) => ({
      ...prev,
      pushTemplates: (prev.pushTemplates || []).map((t) =>
        t.id === id ? { ...t, [field]: value } : t
      )
    }));
  };

  const handleNewsletterChange = (field, value) => {
    setNotifications((prev) => ({
      ...prev,
      emailNewsletters: { ...(prev.emailNewsletters || {}), [field]: value }
    }));
  };

  const handleInAppChange = (field, value) => {
    setNotifications((prev) => ({
      ...prev,
      inAppAlerts: { ...(prev.inAppAlerts || {}), [field]: value }
    }));
  };

  const handleSendTestPush = (templateName) => {
    setTestSentStatus(`Sample push dispatched for "${templateName}"!`);
    setTimeout(() => setTestSentStatus(null), 3500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ notifications });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-indigo-400" />
            <span>Notifications & Email Templates</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure push notification copy, automated seasonal round-up newsletters, and in-app threshold triggers.
          </p>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Notification Settings'}</span>
        </button>
      </div>

      {testSentStatus && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{testSentStatus}</span>
        </div>
      )}

      {/* Push Notification Templates */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-purple-400" />
            <span>Push Notification Copy & Templates</span>
          </h3>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
            <span>Tokens:</span>
            <code className="text-purple-300 bg-purple-950/60 px-1.5 py-0.5 rounded">{"{title}"}</code>
            <code className="text-cyan-300 bg-cyan-950/60 px-1.5 py-0.5 rounded">{"{ep}"}</code>
            <code className="text-emerald-300 bg-emerald-950/60 px-1.5 py-0.5 rounded">{"{username}"}</code>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(notifications.pushTemplates || []).map((template) => (
            <div
              key={template.id}
              className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{template.name}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={template.enabled !== false}
                      onChange={(e) => handleTemplateChange(template.id, 'enabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Push Title</label>
                  <input
                    type="text"
                    value={template.title}
                    onChange={(e) => handleTemplateChange(template.id, 'title', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Push Body Template</label>
                  <textarea
                    rows="2"
                    value={template.template}
                    onChange={(e) => handleTemplateChange(template.id, 'template', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSendTestPush(template.name)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-purple-950/40 border border-slate-700 hover:border-purple-500/50 text-[11px] font-semibold text-slate-300 hover:text-purple-300 transition-all"
                >
                  <Send className="w-3 h-3" />
                  <span>Send Test Push</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Email Newsletters */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Mail className="w-4 h-4 text-cyan-400" />
          <span>Email Newsletters & Seasonal Round-ups</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Seasonal Dispatch Cadence
            </label>
            <select
              value={notifications.emailNewsletters?.seasonalRoundupSchedule || 'bi-weekly'}
              onChange={(e) => handleNewsletterChange('seasonalRoundupSchedule', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none"
            >
              <option value="weekly">Weekly Anime Digest</option>
              <option value="bi-weekly">Bi-Weekly Seasonal Round-up</option>
              <option value="monthly">Monthly Otaku Spotlight</option>
              <option value="quarterly">Quarterly Seasonal Kickoff (Cour Start)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Default Sender Address
            </label>
            <input
              type="email"
              value={notifications.emailNewsletters?.senderEmail || 'newsletter@anipulse.io'}
              onChange={(e) => handleNewsletterChange('senderEmail', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none font-mono"
            />
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <div>
                <span className="text-xs font-semibold text-white">Personalized Recommendations</span>
                <p className="text-[11px] text-slate-400">Tailor roundups based on user watch history</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.emailNewsletters?.personalizedRecsEnabled !== false}
                  onChange={(e) => handleNewsletterChange('personalizedRecsEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* In-App Alerts Thresholds */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-400" />
          <span>In-App Alert Thresholds & Permissions</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              New Season Alert Threshold
            </label>
            <select
              value={notifications.inAppAlerts?.newSeasonThreshold || 'Top 25 MAL Rated & Simulcasts'}
              onChange={(e) => handleInAppChange('newSeasonThreshold', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none"
            >
              <option value="All New Seasons">All Cataloged Releases</option>
              <option value="Top 25 MAL Rated & Simulcasts">Top 25 MAL Rated & Simulcasts (Recommended)</option>
              <option value="Top 10 Spotlight Only">Top 10 Spotlight Only</option>
              <option value="Watchlist Matches Only">User Watchlist Matches Only</option>
            </select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <div>
                <span className="text-xs font-semibold text-white">Watch-Party Invite Popups</span>
                <p className="text-[11px] text-slate-400">Allow friends to send live synchronous watch-party alerts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.inAppAlerts?.watchPartyInvites !== false}
                  onChange={(e) => handleInAppChange('watchPartyInvites', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
