import { Link } from 'react-router-dom';
import ShieldIcon from '../components/ShieldIcon';
import SafetyWarning from '../components/SafetyWarning';
import { useGame, useGameDispatch } from '../store/GameContext';
import { getAppTitle, getOfflineNotice } from '../data/questions';

export default function HeroPage() {
  const { language } = useGame();
  const dispatch = useGameDispatch();
  const isUrdu = language === 'ur';

  function setLang(langCode) {
    dispatch({ type: 'SET_LANGUAGE', payload: langCode });
  }

  return (
    <div className={`page-container flex flex-col items-center justify-center text-center ${isUrdu ? 'rtl' : ''}`}>
      {/* Visual Cybersecurity Shield */}
      <div className="animate-fade-in mb-6 sm:mb-8 mt-2">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-shield-500/25 rounded-full blur-3xl scale-125" />
          <ShieldIcon size={140} className="relative z-10 drop-shadow-2xl" />
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-black mb-3 animate-slide-up leading-tight tracking-tight">
        <span className="text-gradient">Hifazat Dojo</span>
      </h1>

      <p className="text-navy-200 text-sm sm:text-lg md:text-xl mb-3 max-w-2xl animate-slide-up font-medium">
        {getAppTitle()}
      </p>

      {/* Tagline */}
      <p
        className="text-shield-400 text-lg sm:text-2xl md:text-3xl font-extrabold mb-6 max-w-2xl animate-slide-up leading-snug"
        style={{ animationDelay: '0.1s' }}
      >
        {isUrdu
          ? '“سکیم پہچانو، اپنی حفاظت کرو، اور کمیونٹی گارڈین بنو۔”'
          : '“Scam pehchano, apni hifazat karo, aur Community Guardian bano.”'}
      </p>

      {/* Quick Language Selector on Hero */}
      <div className="flex items-center gap-2 mb-8 animate-slide-up" style={{ animationDelay: '0.15s' }}>
        <button
          onClick={() => setLang('ur')}
          className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
            isUrdu
              ? 'bg-shield-500 text-white shadow-md'
              : 'bg-navy-800 text-navy-300 hover:text-white'
          }`}
        >
          🇵🇰 اردو (Urdu)
        </button>
        <button
          onClick={() => setLang('en')}
          className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
            !isUrdu
              ? 'bg-shield-500 text-white shadow-md'
              : 'bg-navy-800 text-navy-300 hover:text-white'
          }`}
        >
          🇬🇧 English
        </button>
      </div>

      {/* Primary Action Buttons */}
      <div
        className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 w-full sm:w-auto justify-center animate-slide-up"
        style={{ animationDelay: '0.2s' }}
      >
        <Link to="/levels" className="btn-primary text-center">
          {isUrdu ? '🎮 ڈوجو گیم شروع کریں' : '🎮 Start Dojo Game'}
        </Link>
        <Link to="/about" className="btn-secondary text-center">
          {isUrdu ? '📖 کیسے کھیلیں اور اصول' : '📖 How to Play & Rules'}
        </Link>
        <Link to="/teacher" className="btn-secondary text-center">
          {isUrdu ? '👨‍🏫 اساتذہ ڈیش بورڈ' : '👨‍🏫 For Teachers'}
        </Link>
      </div>

      {/* Offline Notice & Prominent Safety Disclaimer */}
      <div className="max-w-2xl w-full animate-slide-up space-y-3" style={{ animationDelay: '0.3s' }}>
        <div className="glass p-3.5 text-navy-300 text-xs sm:text-sm flex items-center justify-center gap-2">
          <span>📴</span>
          <span>{getOfflineNotice()}</span>
        </div>
        <SafetyWarning />
      </div>

      {/* 4 Steps How to Play Summary */}
      <div className="max-w-3xl w-full mt-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <h2 className="section-title text-xl sm:text-2xl text-center mb-6">
          {isUrdu ? '🎯 کھیل کے مراحل اور اصول' : '🎯 How the Dojo Challenge Works'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {[
            {
              icon: '1️⃣',
              en: 'Read the realistic fictional scenario carefully',
              ur: 'فرضی پیغام، کال یا لنک کا منظر غور سے پڑھیں',
            },
            {
              icon: '2️⃣',
              en: 'Decide: Is it Safe or a Scam?',
              ur: 'صرف ایک کلک میں فیصلہ کریں: محفوظ ہے یا سکیم؟',
            },
            {
              icon: '3️⃣',
              en: 'Learn from bilingual hints and actionable advice',
              ur: 'اردو اور انگریزی وضاحت اور عملی اقدام سے سیکھیں',
            },
            {
              icon: '4️⃣',
              en: 'Score 70%+ to unlock the next Dojo level',
              ur: '۱۰ میں سے ۷ درست جوابات دے کر اگلا ڈوجو کھولیں',
            },
          ].map((step, i) => (
            <div key={i} className="card text-left flex items-start gap-3 p-4">
              <span className="text-2xl flex-shrink-0">{step.icon}</span>
              <div>
                <p className={`text-white text-xs sm:text-sm font-medium ${isUrdu ? 'text-right font-urdu' : ''}`}>
                  {isUrdu ? step.ur : step.en}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
