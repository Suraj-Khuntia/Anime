import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Mail,
  Shield,
  Calendar,
  Lock,
  Camera,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Compass,
  KeyRound,
  Eye,
  EyeOff,
  Star,
  Upload,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

// Reliable curated anime avatar presets
const ANIME_AVATARS = [
  {
    name: 'Satoru Gojo',
    anime: 'Jujutsu Kaisen',
    url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Frieren',
    anime: "Frieren: Beyond Journey's End",
    url: 'https://cdn.myanimelist.net/images/anime/1015/138075l.jpg',
  },
  {
    name: 'Sung Jinwoo',
    anime: 'Solo Leveling',
    url: 'https://cdn.myanimelist.net/images/anime/1097/141014l.jpg',
  },
  {
    name: 'Tanjiro Kamado',
    anime: 'Demon Slayer',
    url: 'https://cdn.myanimelist.net/images/anime/1286/99889l.jpg',
  },
  {
    name: 'Eren Yeager',
    anime: 'Attack on Titan',
    url: 'https://cdn.myanimelist.net/images/anime/10/47347l.jpg',
  },
  {
    name: 'Rintarou Okabe',
    anime: 'Steins;Gate',
    url: 'https://cdn.myanimelist.net/images/anime/1935/127974l.jpg',
  },
  {
    name: 'Edward Elric',
    anime: 'Fullmetal Alchemist',
    url: 'https://cdn.myanimelist.net/images/anime/1223/96541l.jpg',
  },
  {
    name: 'Hitori Gotoh',
    anime: 'Bocchi the Rock!',
    url: 'https://cdn.myanimelist.net/images/anime/1448/127956l.jpg',
  },
];

// Client-side image compressor for lightweight, instantaneous upload to NeonDB
const compressAvatar = (file, maxDim = 400, quality = 0.85) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('Failed to decode image'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

export default function Profile() {
  const {
    currentUser,
    isUserLoggedIn,
    openAuthModal,
    updateProfile,
    changePassword,
    isLoading,
  } = useAuth();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'edit' | 'security'

  // Edit Profile Form State
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [customAvatarInput, setCustomAvatarInput] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(null);
  const [profileError, setProfileError] = useState(null);

  // Hidden file input ref
  const fileInputRef = useRef(null);

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [securitySuccess, setSecuritySuccess] = useState(null);
  const [securityError, setSecurityError] = useState(null);

  // Sync state when currentUser is loaded
  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.name || '');
      setAvatarUrl(currentUser.avatarUrl || '');
      setCustomAvatarInput(currentUser.avatarUrl || '');
    }
  }, [currentUser]);

  // Handle local file selection from computer with instant auto-save to NeonDB
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image format
    if (!file.type.startsWith('image/')) {
      setProfileError('Please select a valid image file (.png, .jpg, .jpeg, .webp, .gif).');
      return;
    }

    setIsUpdatingProfile(true);
    setProfileError(null);
    setProfileSuccess('Uploading and storing your avatar in NeonDB...');

    try {
      // 1. Compress image to clean, lightweight 400x400 JPG (~30KB-50KB)
      const compressedDataUrl = await compressAvatar(file, 400, 0.85);

      setAvatarUrl(compressedDataUrl);
      setCustomAvatarInput('');
      setSelectedFileName(file.name);

      // 2. Immediately save to NeonDB
      await updateProfile({
        name: displayName.trim() || currentUser?.name || 'User',
        avatarUrl: compressedDataUrl,
      });

      setProfileSuccess(`✓ "${file.name}" uploaded and saved in NeonDB successfully!`);
      setTimeout(() => setProfileSuccess(null), 5000);
    } catch (err) {
      console.error('Avatar upload to NeonDB failed:', err);
      setProfileError(err.response?.data?.message || err.message || 'Failed to save avatar to NeonDB');
    } finally {
      setIsUpdatingProfile(false);
      e.target.value = '';
    }
  };

  // Trigger local file selection dialog
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Select an anime preset and auto-save directly to NeonDB
  const handleSelectPreset = async (preset) => {
    setAvatarUrl(preset.url);
    setCustomAvatarInput(preset.url);
    setSelectedFileName('');
    setProfileError(null);
    setIsUpdatingProfile(true);
    setProfileSuccess(`Saving ${preset.name} to NeonDB...`);

    try {
      await updateProfile({
        name: displayName.trim() || currentUser?.name || 'User',
        avatarUrl: preset.url,
      });
      setProfileSuccess(`✓ ${preset.name} avatar saved to NeonDB!`);
      setTimeout(() => setProfileSuccess(null), 4000);
    } catch (err) {
      setProfileError(err.response?.data?.message || err.message || 'Failed to save avatar');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Remove avatar (revert to initials) and save to NeonDB
  const handleRemoveAvatar = async () => {
    setAvatarUrl('');
    setCustomAvatarInput('');
    setSelectedFileName('');
    setIsUpdatingProfile(true);
    try {
      await updateProfile({
        name: displayName.trim() || currentUser?.name || 'User',
        avatarUrl: null,
      });
      setProfileSuccess('✓ Avatar removed and updated in NeonDB!');
      setTimeout(() => setProfileSuccess(null), 4000);
    } catch (err) {
      setProfileError('Failed to remove avatar');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Handle Edit Profile manual submission (e.g. for display name or custom URL)
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);

    if (!displayName.trim()) {
      setProfileError('Display name is required');
      return;
    }

    setIsUpdatingProfile(true);
    try {
      await updateProfile({
        name: displayName.trim(),
        avatarUrl: avatarUrl ? avatarUrl.trim() : null,
      });
      setProfileSuccess('✓ Profile details saved to NeonDB successfully!');
      setSelectedFileName('');
      setTimeout(() => setProfileSuccess(null), 4000);
    } catch (err) {
      setProfileError(err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Handle Password Change submission
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setSecurityError(null);
    setSecuritySuccess(null);

    if (!currentPassword || !newPassword) {
      setSecurityError('All password fields are required');
      return;
    }
    if (newPassword.length < 6) {
      setSecurityError('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setSecurityError('New passwords do not match');
      return;
    }

    setIsChangingPassword(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setSecuritySuccess('✓ Password updated successfully in NeonDB!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => setSecuritySuccess(null), 4000);
    } catch (err) {
      setSecurityError(err.response?.data?.message || err.message || 'Incorrect current password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Format joined date
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // If loading session
  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  // If not authenticated, show sign-in prompt
  if (!isUserLoggedIn || !currentUser) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-slate-900/80 border border-slate-800 rounded-3xl text-center shadow-2xl backdrop-blur-xl">
        <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-5">
          <User className="w-8 h-8 text-purple-400" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2">Member Profile</h2>
        <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
          Please sign in or create an AniPulse account to view your profile, customize your anime avatar, and manage your account.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => openAuthModal('signin')}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/30 transition-all"
          >
            Sign In Now
          </button>
          <button
            onClick={() => openAuthModal('signup')}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-all"
          >
            Create Free Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Hidden file input for native file selection dialog */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
        className="hidden"
      />

      {/* 1. Header Banner & Profile Hero */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-[#0f172a] shadow-2xl">
        {/* Banner Cover Gradient */}
        <div className="h-44 sm:h-52 w-full bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(168,85,247,0.35),transparent)]" />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs font-semibold text-purple-300">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AniPulse Otaku Pass</span>
          </div>
        </div>

        {/* User Info Section */}
        <div className="px-6 sm:px-10 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20">
            {/* Avatar & Name */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              <div className="relative group">
                <div
                  onClick={triggerFileInput}
                  title="Click to choose a photo from your computer (auto-saves to NeonDB)"
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl p-1 bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 shadow-xl shadow-purple-900/40 cursor-pointer hover:scale-105 transition-transform"
                >
                  <div className="w-full h-full rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center relative">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={currentUser.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="text-4xl font-extrabold text-purple-300 uppercase">
                        {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                      </span>
                    )}

                    {/* Hover Overlay with text */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity">
                      <Camera className="w-6 h-6 mb-1 text-purple-300" />
                      <span className="text-[10px] font-bold tracking-tight">Upload File</span>
                    </div>
                  </div>
                </div>

                {/* Direct Camera Button -> triggers local file selector */}
                <button
                  type="button"
                  onClick={triggerFileInput}
                  title="Select image from device"
                  className="absolute bottom-1 right-1 p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-lg border border-purple-400/40 transition-transform group-hover:scale-110 flex items-center justify-center"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-black text-white">{currentUser.name}</h1>
                  <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold uppercase tracking-wider">
                    Member
                  </span>
                </div>
                <p className="text-sm text-slate-400 mt-1 flex items-center justify-center sm:justify-start gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{currentUser.email}</span>
                </p>
                <p className="text-xs text-slate-500 mt-1 flex items-center justify-center sm:justify-start gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-600" />
                  <span>Member since {formatDate(currentUser.createdAt)}</span>
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap justify-center sm:justify-end gap-2 pt-2 sm:pt-0">
              <button
                type="button"
                onClick={triggerFileInput}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-xs font-semibold text-purple-300 hover:text-white transition-all shadow-sm"
              >
                <Upload className="w-3.5 h-3.5 text-purple-400" />
                <span>Choose Local File</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('edit')}
                className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-all shadow-sm"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex border-b border-slate-800 space-x-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-4 text-sm font-semibold transition-all relative ${
            activeTab === 'overview'
              ? 'text-purple-400 border-b-2 border-purple-500'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('edit')}
          className={`pb-3 px-4 text-sm font-semibold transition-all relative ${
            activeTab === 'edit'
              ? 'text-purple-400 border-b-2 border-purple-500'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Edit Profile & Avatar
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 px-4 text-sm font-semibold transition-all relative ${
            activeTab === 'security'
              ? 'text-purple-400 border-b-2 border-purple-500'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Security & Password
        </button>
      </div>

      {/* Global Action Notifications */}
      {profileSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{profileSuccess}</span>
        </div>
      )}

      {profileError && (
        <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>{profileError}</span>
        </div>
      )}

      {/* 3. TAB CONTENT */}

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
          {/* Account Details Card */}
          <div className="md:col-span-2 bg-[#0f172a] border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Account Information</h3>
              <p className="text-xs text-slate-400">Personal details and current status</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Display Name</span>
                <p className="text-base font-bold text-white mt-1">{currentUser.name}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Email Address</span>
                <p className="text-base font-bold text-white mt-1 truncate">{currentUser.email}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Membership Tier</span>
                <p className="text-base font-bold text-purple-400 mt-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Free Otaku Member</span>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Database Sync</span>
                <p className="text-base font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                  <Shield className="w-4 h-4" />
                  <span>NeonDB Connected</span>
                </p>
              </div>
            </div>

            {/* Quick Anime Jump */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-400">Looking for anime to watch tonight?</span>
              <Link
                to="/browse"
                className="flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300"
              >
                <Compass className="w-4 h-4" />
                <span>Explore Catalog →</span>
              </Link>
            </div>
          </div>

          {/* Quick Stats Sidebar */}
          <div className="space-y-4">
            <div className="bg-[#0f172a] border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-purple-400" />
                <span>Anime Pulse Stats</span>
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-slate-800/80 text-xs">
                  <span className="text-slate-400">Available Episodes</span>
                  <span className="font-bold text-white">150+ Episodes</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-800/80 text-xs">
                  <span className="text-slate-400">Streaming Mode</span>
                  <span className="font-bold text-emerald-400">HD Embed Active</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-800/80 text-xs">
                  <span className="text-slate-400">Database Engine</span>
                  <span className="font-bold text-purple-300">Neon Cloud PostgreSQL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EDIT PROFILE & AVATAR */}
      {activeTab === 'edit' && (
        <div className="bg-[#0f172a] border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xl animate-fadeIn space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Edit Profile Details</h3>
            <p className="text-xs text-slate-400">Change your display name and choose a custom, local file, or anime preset avatar</p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Display Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Display Name</label>
              <div className="relative max-w-md">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* LOCAL FILE UPLOAD CARD */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-300">
                  Upload Avatar from Your Computer / Local File
                </label>
                <span className="text-[11px] text-emerald-400 font-semibold">⚡ Auto-saves to NeonDB</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border-2 border-dashed border-purple-500/40 hover:border-purple-500 transition-colors flex flex-col sm:flex-row items-center gap-4">
                {/* Thumbnail Preview */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 flex-shrink-0 flex items-center justify-center relative">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-slate-600" />
                  )}
                  {isUpdatingProfile && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <RefreshCw className="w-5 h-5 text-purple-400 animate-spin" />
                    </div>
                  )}
                </div>

                {/* Upload Actions */}
                <div className="flex-1 text-center sm:text-left space-y-1.5">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      disabled={isUpdatingProfile}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-md shadow-purple-600/30 flex items-center gap-1.5 transition-all disabled:opacity-50"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Choose Local Image File</span>
                    </button>

                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        disabled={isUpdatingProfile}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Avatar</span>
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400">
                    {selectedFileName ? (
                      <span className="text-purple-300 font-medium">File: {selectedFileName}</span>
                    ) : (
                      'Selecting any image automatically stores it into your NeonDB account.'
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Curated Anime Avatar Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-300">
                  Or Choose an Anime Character Preset
                </label>
                <span className="text-[11px] text-slate-500">Click to auto-save</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {ANIME_AVATARS.map((item) => {
                  const isSelected = avatarUrl === item.url;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => handleSelectPreset(item)}
                      className={`relative flex flex-col items-center p-3 rounded-2xl border transition-all text-center ${
                        isSelected
                          ? 'bg-purple-900/30 border-purple-500 shadow-lg shadow-purple-600/20 ring-1 ring-purple-500'
                          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden mb-2 border border-slate-700/60 bg-slate-800">
                        <img
                          src={item.url}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs font-bold text-white">{item.name}</span>
                      <span className="text-[10px] text-slate-400 truncate max-w-full">{item.anime}</span>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center shadow">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Avatar URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Or Provide an External Image URL</label>
              <div className="flex gap-2 max-w-lg">
                <input
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={customAvatarInput}
                  onChange={(e) => {
                    setCustomAvatarInput(e.target.value);
                    setAvatarUrl(e.target.value);
                    setSelectedFileName('');
                  }}
                  className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
                {customAvatarInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setCustomAvatarInput('');
                      setAvatarUrl('');
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-800 text-xs text-slate-400 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="py-3 px-7 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all disabled:opacity-60"
            >
              {isUpdatingProfile ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving to NeonDB...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Profile Changes</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: SECURITY & PASSWORD */}
      {activeTab === 'security' && (
        <div className="bg-[#0f172a] border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xl animate-fadeIn space-y-6 max-w-2xl">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Change Account Password</h3>
            <p className="text-xs text-slate-400">Update your current password to keep your account safe</p>
          </div>

          {securitySuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{securitySuccess}</span>
            </div>
          )}

          {securityError && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{securityError}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Current Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showCurrentPw ? 'text' : 'password'}
                  required
                  placeholder="Enter your current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPw(!showCurrentPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">New Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showNewPw ? 'text' : 'password'}
                  required
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw(!showNewPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Confirm New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showNewPw ? 'text' : 'password'}
                  required
                  placeholder="Repeat new password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isChangingPassword}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all disabled:opacity-60"
            >
              {isChangingPassword ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Updating Password in NeonDB...</span>
                </>
              ) : (
                <span>Update Password</span>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
