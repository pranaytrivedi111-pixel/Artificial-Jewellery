import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { LIVE_SALES_NOTIFICATIONS, ASSET_IMAGES } from '../data/productData';

export const LiveSalesToasts: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 3500);

    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % LIVE_SALES_NOTIFICATIONS.length);
        setIsVisible(true);
      }, 800);
    }, 8500);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isDismissed]);

  if (isDismissed || !isVisible) return null;

  const currentNotification = LIVE_SALES_NOTIFICATIONS[currentIndex];

  return (
    <div className="fixed bottom-16 sm:bottom-6 left-3 sm:left-4 z-40 max-w-[280px] sm:max-w-xs bg-white/95 backdrop-blur-md rounded-xl p-2.5 border border-gray-200 shadow-xl flex items-center gap-2.5 animate-fadeIn">
      <div className="w-10 h-10 rounded-lg overflow-hidden bg-amber-50 shrink-0 border border-amber-200">
        <img
          src={ASSET_IMAGES.hero}
          alt="Pyrite Sun Ring"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0 text-xs">
        <div className="flex items-center gap-1">
          <strong className="text-gray-950 truncate">{currentNotification.name}</strong>
          <span className="text-gray-500 text-[10px]">({currentNotification.city})</span>
        </div>
        <p className="text-[11px] text-amber-800 font-semibold truncate flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
          <span>Bought {currentNotification.item}</span>
        </p>
        <span className="text-[9px] text-gray-400 block">{currentNotification.time} &bull; Astromall Verified</span>
      </div>

      <button
        onClick={() => setIsDismissed(true)}
        className="p-1 text-gray-400 hover:text-black"
        aria-label="Dismiss toast"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};
