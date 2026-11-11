import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useGame, useGameDispatch } from '../store/GameContext';

export default function Navbar() {
  const { language, soundEnabled = true } = useGame();
  const dispatch = useGameDispatch();
  const location = useLocation();
  const isUrdu = language === 'ur';

  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  async function handleInstallClick() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  }

  const links = [
    { to: '/', label_en: 'Home', label_ur: 'ہوم' },
    { to: '/levels', label_en: 'Levels', label_ur: 'لیولز' },
    { to: '/how-to-play', label_en: 'How to Play', label_ur: 'کیسے کھیلیں' },
    { to: '/for-teachers', label_en: 'For Teachers', label_ur: 'اساتذہ' },
    { to: '/about', label_en: 'Safety Guide', label_ur: 'حفاظتی گائیڈ' },
  ];

  function toggleLanguage() {
    dispatch({ type: 'TOGGLE_LANGUAGE' });
  }

  return (
    <nav className="no-print bg-navy-900/90 backdrop-blur-md border-b border-navy-700/60 sticky top-0 z-50 transition-all">
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-shield-400 font-extrabold text-base sm:text-lg hover:text-shield-300 transition-colors flex-shrink-0"
          >
            <span className="text-xl sm:text-2xl drop-shadow">🛡️</span>
            <span className="tracking-tight hidden xs:inline">Hifazat Dojo</span>
          </Link>

          {/* Navigation links & Language Switcher */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1">
            {links.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 whitespace-nowrap ${
                    isActive
                      ? 'bg-shield-500/20 text-shield-300 border border-shield-500/40'
                      : 'text-navy-200 hover:text-white hover:bg-navy-800'
                  }`}
                >
                  {isUrdu ? link.label_ur : link.label_en}
                </Link>
              );
            })}

            {/* Quick 1-Click Language Switcher */}
            <button
              onClick={toggleLanguage}
              title={isUrdu ? 'Switch to English' : 'اردو میں تبدیل کریں'}
              className="ml-1 sm:ml-2 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold bg-navy-800 hover:bg-navy-700 text-shield-400 border border-shield-500/30 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 flex-shrink-0"
            >
              <span className="text-sm">{isUrdu ? '🇬🇧' : '🇵🇰'}</span>
              <span className="hidden sm:inline">{isUrdu ? 'English' : 'اردو'}</span>
            </button>

            {/* Master Exhibition Audio & Sound Effects Toggle */}
            <button
              onClick={() => {
                dispatch({ type: 'TOGGLE_SOUND' });
                if (soundEnabled && typeof window !== 'undefined' && window.speechSynthesis) {
                  window.speechSynthesis.cancel();
                }
              }}
              title={soundEnabled ? (isUrdu ? 'آواز بند کریں (Mute)' : 'Mute Sounds & Speech') : (isUrdu ? 'آواز آن کریں (Unmute)' : 'Unmute Sounds & Speech')}
              className={`ml-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold border transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 flex-shrink-0 ${
                soundEnabled
                  ? 'bg-navy-800 hover:bg-navy-700 text-shield-300 border-shield-500/30'
                  : 'bg-navy-950 text-navy-400 border-navy-700 hover:text-navy-200'
              }`}
            >
              <span className="text-sm">{soundEnabled ? '🔊' : '🔇'}</span>
              <span className="hidden md:inline">{soundEnabled ? (isUrdu ? 'آواز: آن' : 'Sound: ON') : (isUrdu ? 'آواز: بند' : 'Muted')}</span>
            </button>

            {/* PWA Install Button (only shown when browser offers install prompt) */}
            {deferredPrompt && (
              <button
                onClick={handleInstallClick}
                title={isUrdu ? 'آف لائن ایپ انسٹال کریں' : 'Install App for Offline Use'}
                className="ml-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold bg-gradient-to-r from-shield-600 to-emerald-600 text-white border border-shield-400/40 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 flex-shrink-0 shadow-md shadow-shield-500/20 animate-pulse"
              >
                <span className="text-sm">📲</span>
                <span className="hidden sm:inline">{isUrdu ? 'انسٹال' : 'Install'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
