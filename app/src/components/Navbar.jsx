import { Link, useLocation } from 'react-router-dom';
import { useGame, useGameDispatch } from '../store/GameContext';

export default function Navbar() {
  const { language } = useGame();
  const dispatch = useGameDispatch();
  const location = useLocation();
  const isUrdu = language === 'ur';

  const links = [
    { to: '/', label_en: 'Home', label_ur: 'ہوم' },
    { to: '/levels', label_en: 'Levels', label_ur: 'لیولز' },
    { to: '/about', label_en: 'Safety Guide', label_ur: 'حفاظتی گائیڈ' },
    { to: '/teacher', label_en: 'Teachers', label_ur: 'اساتذہ' },
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
            className="flex items-center gap-2 text-shield-400 font-extrabold text-base sm:text-lg hover:text-shield-300 transition-colors"
          >
            <span className="text-xl sm:text-2xl drop-shadow">🛡️</span>
            <span className="tracking-tight">Hifazat Dojo</span>
          </Link>

          {/* Navigation links & Language Switcher */}
          <div className="flex items-center gap-1 sm:gap-2">
            {links.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 ${
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
              className="ml-1 sm:ml-2 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold bg-navy-800 hover:bg-navy-700 text-shield-400 border border-shield-500/30 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span className="text-sm">{isUrdu ? '🇬🇧' : '🇵🇰'}</span>
              <span className="hidden xs:inline">{isUrdu ? 'English' : 'اردو'}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
