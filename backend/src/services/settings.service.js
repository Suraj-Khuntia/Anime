const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

const DEFAULT_SETTINGS = {
  // 1. Community & Social Features
  community: {
    bioMaxLength: 350,
    favoriteAnimeLimit: 10,
    commentsModeration: 'auto', // 'auto' | 'require_approval' | 'strict'
    spoilerHideToggle: true,
    starScoreWeight: 65,
    writtenReviewWeight: 35,
    discordUrl: 'https://discord.gg/anipulse',
    forumUrl: 'https://community.anipulse.io',
    badges: [
      { id: 'og', name: 'Original Otaku', color: 'from-amber-400 to-orange-500', icon: 'Crown', desc: 'Platform early adopter' },
      { id: 'critic', name: 'Top Reviewer', color: 'from-blue-500 to-indigo-600', icon: 'Award', desc: 'Over 20+ verified in-depth reviews' },
      { id: 'vip', name: 'VIP Supporter', color: 'from-purple-500 to-pink-500', icon: 'Sparkles', desc: 'AniPulse Supporter Tier Member' },
      { id: 'binge', name: 'Binge Legend', color: 'from-emerald-400 to-teal-600', icon: 'Zap', desc: 'Completed 100+ anime series' }
    ],
    announcementBanner: {
      enabled: true,
      text: '🎉 Fall 2026 Anime Simulcasts are live! Enjoy high-bitrate streaming with customizable subtitles.',
      type: 'promo', // 'info' | 'warning' | 'promo'
      link: '/browse?status=Airing'
    },
    moderationRules: [
      'No unflagged spoilers in episode comments. Mark spoiler text with spoiler tags.',
      'Constructive discussions only — hate speech, harassment, or flame wars will result in instant suspension.',
      'No unauthorized piracy links or malicious download mirrors.'
    ]
  },

  // 2. Notifications & Emails
  notifications: {
    pushTemplates: [
      { id: 'ep_release', name: 'New Episode Released', title: 'New Episode Live! 🔥', template: 'Episode {ep} of "{title}" is now available in 1080p!', enabled: true },
      { id: 'weekly_trending', name: 'Weekly Trending Hotlist', title: 'Weekly Top Otaku Picks 🌟', template: 'Discover the top 5 trending anime everyone is talking about this week!', enabled: true },
      { id: 'seasonal_premiere', name: 'Seasonal Premiere Alert', title: 'New Season Premiere 🚀', template: '"{title}" just aired its pilot episode! Check it out now.', enabled: true },
      { id: 'watch_party', name: 'Watch Party Invite', title: 'Otaku Watch Party 🍿', template: '{username} invited you to watch "{title}" together!', enabled: true }
    ],
    emailNewsletters: {
      seasonalRoundupSchedule: 'bi-weekly',
      personalizedRecsEnabled: true,
      senderEmail: 'newsletter@anipulse.io',
      lastSent: '2026-10-20'
    },
    inAppAlerts: {
      newSeasonThreshold: 'Top 25 MAL Rated & Simulcasts',
      watchPartyInvites: true,
      systemMaintenanceNotice: true
    }
  },

  // 3. Localization & Accessibility
  localization: {
    languages: [
      { code: 'en', name: 'English', nativeName: 'English', default: true, progress: 100 },
      { code: 'ja', name: 'Japanese', nativeName: '日本語', default: false, progress: 95 },
      { code: 'es', name: 'Spanish', nativeName: 'Español', default: false, progress: 88 },
      { code: 'fr', name: 'French', nativeName: 'Français', default: false, progress: 82 },
      { code: 'de', name: 'German', nativeName: 'Deutsch', default: false, progress: 75 }
    ],
    subtitleDubQualityTags: ['1080p HD', '720p SD', 'Official Dub', 'Fan-sub', 'Dual Audio (EN/JA)'],
    accessibility: {
      closedCaptionStyling: {
        fontSize: 'Medium (18px)',
        textColor: '#FFFFFF',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        textShadow: true
      },
      highContrastMode: false,
      audioDescriptionFlags: true
    }
  },

  // 4. Analytics & Reporting
  analytics: {
    dashboardWidgets: {
      topWatchedByRegion: [
        { region: 'North America', percent: 36, views: '1.42M' },
        { region: 'East Asia', percent: 28, views: '1.10M' },
        { region: 'Europe', percent: 20, views: '790K' },
        { region: 'Latin America', percent: 11, views: '430K' },
        { region: 'Others', percent: 5, views: '198K' }
      ],
      retentionMetrics: {
        ep1ToEp2Retention: '79.2%',
        seriesCompletionRate: '61.5%',
        averageSessionMinutes: '28.4 min'
      }
    },
    abExperiments: [
      { id: 'exp_hero', name: 'Homepage Hero Carousel vs Split Banner', status: 'Active', split: '50/50', primaryMetric: 'Trailer Play Rate (+14.2% Variant B)' },
      { id: 'exp_card', name: 'Anime Card Score Badge (Glass vs Solid)', status: 'Active', split: '50/50', primaryMetric: 'Detail Page CTR (+8.7% Variant A)' },
      { id: 'exp_recs', name: 'Genre-weighted vs Watch-history Recs', status: 'Draft', split: '60/40', primaryMetric: 'Watch Duration' }
    ],
    errorAlerts: [
      { id: 'err_101', type: 'Broken Trailer Link', target: 'Attack on Titan Final Season', code: 'YT_ERR_404', date: '2026-10-26 18:30', status: 'Open' },
      { id: 'err_102', type: 'Playback Buffer Lag', target: 'Stream Node Singapore-02', code: 'CDN_LATENCY_WARN', date: '2026-10-25 22:15', status: 'Resolved' },
      { id: 'err_103', type: 'Jikan API Sync Rate Limit', target: 'SyncCron Worker', code: 'HTTP_429_TOO_MANY_REQUESTS', date: '2026-10-24 04:00', status: 'Resolved' }
    ]
  },

  // 5. Monetization
  monetization: {
    premiumPerks: [
      { id: 'perk_adfree', title: 'Ad-Free High Bitrate Streaming', description: 'Zero video interruptions and buttery 1080p 60fps streams', enabled: true },
      { id: 'perk_early', title: 'Simulcast Early Access (1hr ahead)', description: 'Watch fresh Japanese TV broadcasts before public release', enabled: true },
      { id: 'perk_wallpapers', title: 'Exclusive 4K Wallpapers & OST Downloads', description: 'Curated high-res official illustrations and opening/ending themes', enabled: true },
      { id: 'perk_badge', title: 'Golden Star Profile Flair & Custom Themes', description: 'Stand out in comment threads with animated badges', enabled: true }
    ],
    storeItems: [
      { id: 'item_1', name: 'Cyber Otaku Neon Avatar Frame', category: 'Profile Cosmetic', priceCoins: 450, priceUsd: '$3.99', stock: 'Unlimited', active: true },
      { id: 'item_2', name: 'Shinigami Soul Hunter Cloak (Avatar)', category: 'Profile Cosmetic', priceCoins: 700, priceUsd: '$5.99', stock: 'Limited (240 left)', active: true },
      { id: 'item_3', name: 'AniPulse 1,200 Star Crystals Bundle', category: 'Virtual Currency', priceCoins: 0, priceUsd: '$9.99', stock: 'Unlimited', active: true },
      { id: 'item_4', name: 'AniPulse Oversized Anime Tour Hoodie', category: 'Physical Merch', priceCoins: 0, priceUsd: '$54.00', stock: '48 units', active: true }
    ]
  },

  // 6. Technical Settings
  technical: {
    cachingRules: {
      coverThumbnailsTtlHours: 168,
      apiResponsesTtlMinutes: 15,
      staleWhileRevalidate: true,
      purgeCacheOnSync: true
    },
    cdnEndpoints: {
      primaryProvider: 'Cloudflare Enterprise Edge',
      regionalNodes: ['Tokyo (NRT-01)', 'Osaka (KIX-01)', 'Frankfurt (FRA-02)', 'San Jose (SJC-01)', 'Singapore (SIN-01)'],
      storageBucketUri: 'https://cdn.anipulse.media/anime-vault-v1'
    },
    rateLimits: {
      jikanApiSyncPerMinute: 30,
      publicApiSearchPerMinute: 60,
      streamPlaybackConcurrentSessions: 3
    }
  },

  // 7. UI & Discovery + Recommendations
  discovery: {
    curatedPlaylists: [
      { id: 'pl_1', title: 'Study-Break Chill Picks', subtitle: 'Relaxing slice-of-life and soothing melodies', animeCount: 8, banner: 'study' },
      { id: 'pl_2', title: 'High-Energy Shounen Hype', subtitle: 'Peak adrenaline battle sequences and training arcs', animeCount: 12, banner: 'hype' },
      { id: 'pl_3', title: 'Award-Winning Masterpieces', subtitle: 'Critically acclaimed narratives with unforgettable climaxes', animeCount: 10, banner: 'award' }
    ],
    algorithmWeights: {
      genreRelevance: 45,
      watchHistory: 35,
      starRatings: 20
    },
    popularityMetrics: {
      hotRightNowMinViews: 3500,
      trendingDecayHalfLifeDays: 5
    },
    searchFilters: ['Award-Winning', 'Studio MAPPA', 'Studio Ghibli', 'Ufotable', 'Isekai', 'Dark Fantasy', 'Cyberpunk', 'Rom-Com']
  },

  // 8. Maintenance & Misc.
  maintenance: {
    checklist: [
      { id: 'chk_1', text: 'Backup current DB entries before bulk edits', checked: true, critical: true },
      { id: 'chk_2', text: 'Test changes on a staging environment or with a small user group', checked: true, critical: true },
      { id: 'chk_3', text: 'Communicate any UI tweaks via an in-app banner so users know what’s new', checked: true, critical: false },
      { id: 'chk_4', text: 'Monitor analytics for a few days to catch unexpected drops in engagement', checked: false, critical: false }
    ],
    userFeedback: [
      { id: 'fb_1', user: 'TanjiroFan2026', email: 'tanjiro@otakumail.com', topic: 'Sub/Dub Player Shortcut', message: 'Would love a keyboard shortcut (e.g. key "S") to toggle subtitle tracks!', date: '2026-10-26 21:10', status: 'Reviewing' },
      { id: 'fb_2', user: 'GojoSensei', email: 'satoru@jujutsu.net', topic: 'High-Contrast Theme', message: 'The dark mode looks awesome, high-contrast subtitles helped immensely on my tablet!', date: '2026-10-25 15:40', status: 'Implemented' },
      { id: 'fb_3', user: 'LuffyPirateKing', email: 'luffy@grandline.jp', topic: 'Request Studio Filter', message: 'Can we filter anime specifically by animation studio in the Browse page?', date: '2026-10-24 09:20', status: 'Planned' }
    ],
    faqArticles: [
      { id: 'faq_1', question: 'How frequently are new episodes synced?', answer: 'Our Jikan API sync engine queries official sources automatically every 6 hours and updates episode status instantaneously.' },
      { id: 'faq_2', question: 'What video resolutions are supported?', answer: 'All player streams support adaptive HD (1080p, 720p, 480p) with options for official dubs and fan-subs.' },
      { id: 'faq_3', question: 'How are community review scores calculated?', answer: 'Ratings use a weighted blend of 65% star scores and 35% verified written reviews to prevent review bombing.' }
    ],
    complianceAndTerms: {
      version: 'v2.4.1 (Updated Oct 2026)',
      dmcaNotice: 'AniPulse complies with international digital rights standards and DMCA safe-harbor provisions.',
      privacyStatement: 'User telemetry and watchlists are encrypted. No third-party data selling.'
    }
  },

  // 9. Anime-style UI/UX Polish Settings
  uiPolish: {
    smoothScroll: true,
    carouselSnapPoints: true,
    microAnimationsSparkle: true,
    darkModeDefault: true,
    highContrastMode: false,
    desktopGridCols: 4,
    tabletGridCols: 2,
    mobileGridCols: 1,
    skeletonShimmer: true
  }
};

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getSettings() {
  ensureDataDir();
  if (!fs.existsSync(SETTINGS_FILE)) {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2), 'utf8');
    return DEFAULT_SETTINGS;
  }
  try {
    const raw = fs.readFileSync(SETTINGS_FILE, 'utf8');
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Error reading settings.json, returning defaults:', err);
    return DEFAULT_SETTINGS;
  }
}

function updateSettings(patch) {
  ensureDataDir();
  const current = getSettings();
  const updated = {
    ...current,
    ...patch,
    community: { ...current.community, ...(patch.community || {}) },
    notifications: { ...current.notifications, ...(patch.notifications || {}) },
    localization: { ...current.localization, ...(patch.localization || {}) },
    analytics: { ...current.analytics, ...(patch.analytics || {}) },
    monetization: { ...current.monetization, ...(patch.monetization || {}) },
    technical: { ...current.technical, ...(patch.technical || {}) },
    discovery: { ...current.discovery, ...(patch.discovery || {}) },
    maintenance: { ...current.maintenance, ...(patch.maintenance || {}) },
    uiPolish: { ...current.uiPolish, ...(patch.uiPolish || {}) }
  };
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2), 'utf8');
  return updated;
}

function resetSettings() {
  ensureDataDir();
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2), 'utf8');
  return DEFAULT_SETTINGS;
}

module.exports = {
  getSettings,
  updateSettings,
  resetSettings,
  DEFAULT_SETTINGS
};
