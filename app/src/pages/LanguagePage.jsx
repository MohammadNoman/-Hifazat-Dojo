import { useNavigate } from 'react-router-dom';
import { useGame, useGameDispatch } from '../store/GameContext';

export default function LanguagePage() {
  const { language } = useGame();
  const dispatch = useGameDispatch();
  const navigate = useNavigate();

  const languages = [
    {
      code: 'ur',
      name: 'Urdu',
      native: 'اردو',
      desc: 'اردو زبان میں کھیلیں (مکمل سپورٹ)',
      flag: '🇵🇰',
      available: true,
    },
    {
      code: 'en',
      name: 'English',
      native: 'English',
      desc: 'Play in English (Full Support)',
      flag: '🇬🇧',
      available: true,
    },
    {
      code: 'sd',
      name: 'Sindhi',
      native: 'سنڌي',
      desc: 'جلد آ رہا ہے (Version 2)',
      flag: '🇵🇰',
      available: false,
    },
  ];

  function handleSelect(code) {
    dispatch({ type: 'SET_LANGUAGE', payload: code });
    navigate('/levels');
  }

  return (
    <div className="page-container flex flex-col items-center justify-center text-center">
      <h1 className="section-title mb-2">🌐 Select Language / زبان منتخب کریں</h1>
      <p className="text-navy-300 mb-8 text-sm sm:text-base max-w-md">
        Choose your preferred language for the Hifazat Dojo challenge
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl w-full">
        {languages.map((lang) => {
          const isSelected = language === lang.code;

          return (
            <button
              key={lang.code}
              onClick={() => lang.available && handleSelect(lang.code)}
              disabled={!lang.available}
              className={`card text-center p-6 sm:p-8 transition-all duration-200 cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'ring-2 ring-shield-400 bg-navy-800 shadow-shield-500/20'
                  : lang.available
                  ? 'hover:ring-1 hover:ring-shield-400/60 hover:bg-navy-700/60 active:scale-95'
                  : 'opacity-40 cursor-not-allowed bg-navy-900/40'
              }`}
            >
              {isSelected && (
                <span className="absolute top-3 right-3 bg-shield-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}

              <span className="text-4xl sm:text-5xl block mb-3">{lang.flag}</span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">{lang.name}</h2>
              <p className="text-lg sm:text-xl text-shield-400 mb-2 font-urdu" dir="rtl">
                {lang.native}
              </p>
              <p className={`text-xs sm:text-sm ${lang.available ? 'text-navy-300' : 'text-danger-400'}`}>
                {lang.desc}
              </p>
              {!lang.available && (
                <span className="inline-block mt-3 text-xs bg-navy-700 text-navy-300 px-3 py-1 rounded-full">
                  🔒 Coming Soon
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
