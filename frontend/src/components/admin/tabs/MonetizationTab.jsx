import React, { useState } from 'react';
import {
  ShoppingBag,
  Sparkles,
  Crown,
  Coins,
  ShieldCheck,
  Clock,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Package
} from 'lucide-react';

export default function MonetizationTab({ settings, onSave, isSaving }) {
  const [monetization, setMonetization] = useState(settings?.monetization || {});
  const [newItem, setNewItem] = useState({ name: '', category: 'Profile Cosmetic', priceCoins: 500, priceUsd: '$4.99', stock: 'Unlimited' });

  const handleTogglePerk = (id) => {
    setMonetization((prev) => ({
      ...prev,
      premiumPerks: (prev.premiumPerks || []).map((p) =>
        p.id === id ? { ...p, enabled: !p.enabled } : p
      )
    }));
  };

  const handlePerkTextChange = (id, field, value) => {
    setMonetization((prev) => ({
      ...prev,
      premiumPerks: (prev.premiumPerks || []).map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      )
    }));
  };

  const handleAddItem = () => {
    if (!newItem.name.trim()) return;
    const item = {
      id: 'item_' + Date.now(),
      name: newItem.name.trim(),
      category: newItem.category,
      priceCoins: parseInt(newItem.priceCoins) || 0,
      priceUsd: newItem.priceUsd.startsWith('$') ? newItem.priceUsd : `$${newItem.priceUsd}`,
      stock: newItem.stock || 'Unlimited',
      active: true
    };
    setMonetization((prev) => ({
      ...prev,
      storeItems: [...(prev.storeItems || []), item]
    }));
    setNewItem({ name: '', category: 'Profile Cosmetic', priceCoins: 500, priceUsd: '$4.99', stock: 'Unlimited' });
  };

  const handleRemoveItem = (id) => {
    setMonetization((prev) => ({
      ...prev,
      storeItems: (prev.storeItems || []).filter((i) => i.id !== id)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ monetization });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <span>Monetization & Otaku Store Settings</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure premium tier benefits (ad-free, early access), exclusive avatar flairs, crystal currency bundles, and physical merch.
          </p>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Monetization Settings'}</span>
        </button>
      </div>

      {/* Premium Perks Editor */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Crown className="w-4 h-4 text-amber-400" />
          <span>AniPulse Plus / Premium Tier Perks</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(monetization.premiumPerks || []).map((perk) => (
            <div
              key={perk.id}
              className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-3"
            >
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={perk.title}
                  onChange={(e) => handlePerkTextChange(perk.id, 'title', e.target.value)}
                  className="font-bold text-xs text-white bg-transparent border-b border-slate-700 focus:border-purple-500 focus:outline-none w-full mr-3 py-1"
                />
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={perk.enabled !== false}
                    onChange={() => handleTogglePerk(perk.id)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <textarea
                rows="2"
                value={perk.description}
                onChange={(e) => handlePerkTextChange(perk.id, 'description', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Store Items & Virtual Currency Catalog */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Coins className="w-4 h-4 text-purple-400" />
          <span>Otaku Store Items & Merchandise Inventory</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Item Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price (Coins)</th>
                <th className="py-3 px-4">Price (USD)</th>
                <th className="py-3 px-4">Inventory Stock</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {(monetization.storeItems || []).map((item) => (
                <tr key={item.id} className="hover:bg-purple-950/10">
                  <td className="py-3 px-4 font-bold text-white">{item.name}</td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 border border-slate-700 text-slate-300">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-amber-300">
                    {item.priceCoins > 0 ? `${item.priceCoins} 🪙` : '—'}
                  </td>
                  <td className="py-3 px-4 font-mono text-emerald-300 font-bold">
                    {item.priceUsd}
                  </td>
                  <td className="py-3 px-4 text-slate-400">{item.stock}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Store Item Box */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 grid grid-cols-1 sm:grid-cols-5 gap-3 items-center">
          <input
            type="text"
            placeholder="Item title (e.g. Neon Frame)"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            className="sm:col-span-2 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
          <select
            value={newItem.category}
            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none"
          >
            <option value="Profile Cosmetic">Profile Cosmetic</option>
            <option value="Virtual Currency">Virtual Currency</option>
            <option value="Physical Merch">Physical Merch</option>
            <option value="Digital Collectible">Digital Collectible</option>
          </select>
          <input
            type="text"
            placeholder="USD (e.g. $4.99)"
            value={newItem.priceUsd}
            onChange={(e) => setNewItem({ ...newItem, priceUsd: e.target.value })}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddItem}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>
      </div>
    </form>
  );
}
