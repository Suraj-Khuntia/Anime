import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Megaphone, X, ArrowRight, Sparkles } from 'lucide-react';
import { getPlatformSettings } from '../../services/api';

export default function AnnouncementBanner() {
  const [banner, setBanner] = useState(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchBanner = async () => {
      try {
        const res = await getPlatformSettings();
        if (isMounted && res.data?.community?.announcementBanner?.enabled) {
          setBanner(res.data.community.announcementBanner);
        }
      } catch (err) {
        // Fallback default banner
        if (isMounted) {
          setBanner({
            enabled: true,
            text: '🎉 Fall 2026 Anime Simulcasts are live! Stream newly cataloged episodes in 1080p!',
            type: 'promo',
            link: '/browse?status=Airing'
          });
        }
      }
    };
    fetchBanner();
    return () => {
      isMounted = false;
    };
  }, []);

  if (!banner || !banner.enabled || isDismissed) {
    return null;
  }

  const isPromo = banner.type === 'promo';
  const isWarning = banner.type === 'warning';

  return (
    <div
      className={`relative z-50 text-xs font-semibold px-4 py-2 flex items-center justify-between transition-all ${
        isPromo
          ? 'bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-purple-900/90 border-b border-purple-500/30 text-purple-100'
          : isWarning
          ? 'bg-amber-950/90 border-b border-amber-500/40 text-amber-200'
          : 'bg-cyan-950/90 border-b border-cyan-500/40 text-cyan-100'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2.5 flex-1 text-center">
        {isPromo ? (
          <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-pulse flex-shrink-0" />
        ) : (
          <Megaphone className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
        )}
        <span className="truncate">{banner.text}</span>
        {banner.link && (
          <Link
            to={banner.link}
            className="inline-flex items-center gap-1 font-bold underline hover:text-white ml-2 flex-shrink-0"
          >
            <span>Explore</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>

      <button
        onClick={() => setIsDismissed(true)}
        className="text-slate-400 hover:text-white p-1 rounded transition-colors ml-2"
        aria-label="Dismiss banner"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
