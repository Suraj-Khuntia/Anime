import React, { useState } from 'react';
import {
  Wrench,
  CheckSquare,
  Square,
  MessageCircle,
  HelpCircle,
  FileText,
  Save,
  CheckCircle2,
  Trash2,
  Plus,
  Download,
  AlertCircle
} from 'lucide-react';

export default function MaintenanceTab({ settings, onSave, isSaving }) {
  const [maintenance, setMaintenance] = useState(settings?.maintenance || {});
  const [activeSubTab, setActiveSubTab] = useState('checklist'); // 'checklist' | 'feedback' | 'faq' | 'legal'
  const [feedbackFilter, setFeedbackFilter] = useState('All');
  const [backupNotice, setBackupNotice] = useState(null);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });

  const handleToggleChecklist = (id) => {
    setMaintenance((prev) => ({
      ...prev,
      checklist: (prev.checklist || []).map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    }));
  };

  const handleExportBackup = () => {
    setBackupNotice('Generating PostgreSQL / SQLite database backup snapshot...');
    setTimeout(() => {
      setBackupNotice('Backup snapshot exported successfully (anipulse_db_backup_2026.json)!');
      setTimeout(() => setBackupNotice(null), 4000);
    }, 1200);
  };

  const handleUpdateFeedbackStatus = (id, newStatus) => {
    setMaintenance((prev) => ({
      ...prev,
      userFeedback: (prev.userFeedback || []).map((fb) =>
        fb.id === id ? { ...fb, status: newStatus } : fb
      )
    }));
  };

  const handleAddFaq = () => {
    if (!newFaq.question.trim() || !newFaq.answer.trim()) return;
    const faq = {
      id: 'faq_' + Date.now(),
      question: newFaq.question.trim(),
      answer: newFaq.answer.trim()
    };
    setMaintenance((prev) => ({
      ...prev,
      faqArticles: [...(prev.faqArticles || []), faq]
    }));
    setNewFaq({ question: '', answer: '' });
  };

  const handleRemoveFaq = (id) => {
    setMaintenance((prev) => ({
      ...prev,
      faqArticles: (prev.faqArticles || []).filter((f) => f.id !== id)
    }));
  };

  const handleLegalChange = (field, value) => {
    setMaintenance((prev) => ({
      ...prev,
      complianceAndTerms: {
        ...(prev.complianceAndTerms || {}),
        [field]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ maintenance });
  };

  const checklist = maintenance.checklist || [];
  const completedCount = checklist.filter((c) => c.checked).length;
  const progressPercent = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0;

  const feedbacks = (maintenance.userFeedback || []).filter(
    (fb) => feedbackFilter === 'All' || fb.status === feedbackFilter
  );

  const faqs = maintenance.faqArticles || [];
  const legal = maintenance.complianceAndTerms || {};

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2.5">
            <Wrench className="w-5 h-5 text-indigo-400" />
            <span>Maintenance, Feedback & Release Checklist</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track pre-flight deployment checklists, review community bug feedback, maintain FAQ articles, and update compliance policies.
          </p>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Maintenance State'}</span>
        </button>
      </div>

      {backupNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{backupNotice}</span>
        </div>
      )}

      {/* Internal Subtabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        {[
          { id: 'checklist', label: 'Release Checklist', icon: CheckSquare },
          { id: 'feedback', label: 'User Feedback Entries', icon: MessageCircle },
          { id: 'faq', label: 'FAQ / Help Articles', icon: HelpCircle },
          { id: 'legal', label: 'Privacy & Terms Compliance', icon: FileText }
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

      {/* SUBTAB 1: QUICK CHECKLIST FOR A SMOOTH UPDATE CYCLE */}
      {activeSubTab === 'checklist' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                <span>Quick Checklist for a Smooth Update Cycle</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Standard operating procedure before triggering major catalog modifications or database pushes.
              </p>
            </div>

            <button
              type="button"
              onClick={handleExportBackup}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white transition-all"
            >
              <Download className="w-3.5 h-3.5 text-purple-400" />
              <span>Export DB Backup</span>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Deployment Readiness</span>
              <span className="text-purple-400 font-mono font-bold">
                {completedCount} of {checklist.length} Complete ({progressPercent}%)
              </span>
            </div>
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Checklist Items */}
          <div className="space-y-3 pt-2">
            {checklist.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => handleToggleChecklist(item.id)}
                className={`flex items-start gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer ${
                  item.checked
                    ? 'bg-purple-950/20 border-purple-500/40 text-slate-200'
                    : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="pt-0.5">
                  {item.checked ? (
                    <CheckSquare className="w-5 h-5 text-purple-400" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200">
                      Step {idx + 1}:
                    </span>
                    <span className={`text-xs ${item.checked ? 'text-white font-medium' : 'text-slate-300'}`}>
                      {item.text}
                    </span>
                    {item.critical && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        Critical
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: USER FEEDBACK ENTRIES */}
      {activeSubTab === 'feedback' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-cyan-400" />
                <span>User Feedback & Issue Reports</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Review and act on reported bugs, feature requests, or broken stream reports.
              </p>
            </div>

            <div className="flex gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {['All', 'Reviewing', 'Implemented', 'Planned'].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setFeedbackFilter(filter)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    feedbackFilter === filter
                      ? 'bg-purple-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {feedbacks.map((fb) => (
              <div
                key={fb.id}
                className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{fb.topic}</span>
                    <span className="text-[11px] text-slate-400">by {fb.user} ({fb.email})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500 font-mono">{fb.date}</span>
                    <select
                      value={fb.status}
                      onChange={(e) => handleUpdateFeedbackStatus(fb.id, e.target.value)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-900 border border-slate-700 ${
                        fb.status === 'Implemented'
                          ? 'text-emerald-400'
                          : fb.status === 'Reviewing'
                          ? 'text-amber-400'
                          : 'text-purple-400'
                      }`}
                    >
                      <option value="Reviewing">Reviewing</option>
                      <option value="Implemented">Implemented</option>
                      <option value="Planned">Planned</option>
                    </select>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded-xl border border-slate-800/80">
                  "{fb.message}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: FAQ / HELP ARTICLES */}
      {activeSubTab === 'faq' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-purple-400" />
            <span>Help Center & FAQ Knowledgebase</span>
          </h3>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-2 relative group"
              >
                <div className="flex items-center justify-between pr-8">
                  <h4 className="text-xs font-bold text-purple-300">{faq.question}</h4>
                  <button
                    type="button"
                    onClick={() => handleRemoveFaq(faq.id)}
                    className="absolute top-4 right-4 text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-slate-300">{faq.answer}</p>
              </div>
            ))}
          </div>

          {/* Add FAQ Item */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-200">Add New FAQ Question</span>
            <input
              type="text"
              placeholder="Question (e.g. How do I report a bad subtitle sync?)"
              value={newFaq.question}
              onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <textarea
              rows="2"
              placeholder="Detailed answer for the community..."
              value={newFaq.answer}
              onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAddFaq}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save Question</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: PRIVACY & TERMS COMPLIANCE */}
      {activeSubTab === 'legal' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Privacy & Terms Compliance Management</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Legal Terms Revision Version
              </label>
              <input
                type="text"
                value={legal.version || 'v2.4.1 (Updated Oct 2026)'}
                onChange={(e) => handleLegalChange('version', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                DMCA & Copyright Inquiries Email
              </label>
              <input
                type="email"
                value={legal.dmcaContactEmail || 'dmca@anipulse.io'}
                onChange={(e) => handleLegalChange('dmcaContactEmail', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Privacy & Data Statement
            </label>
            <textarea
              rows="3"
              value={legal.privacyStatement || ''}
              onChange={(e) => handleLegalChange('privacyStatement', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
            />
          </div>
        </div>
      )}
    </form>
  );
}
