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
      {/* Exhibition Header Badge */}
      <div className="animate-fade-in mb-6">
        <div className="badge-pill bg-shield-950/70 text-shield-300 border-shield-500/40 shadow-lg shadow-shield-500/10">
          <span className="animate-pulse">🟢</span>
          <span>School STREAM Project Exhibition 2026</span>
          <span className="text-navy-400">•</span>
          <span className="text-navy-300">Offline Cyber Simulator</span>
        </div>
      </div>

      {/* Cyber Shield with Radiant Neon Pulse */}
      <div className="animate-fade-in mb-6">
        <div className="relative inline-block animate-float">
          <div className="absolute inset-0 bg-gradient-to-r from-shield-500/30 to-blue-500/20 rounded-full blur-3xl scale-150" />
          <ShieldIcon size={150} className="relative z-10 drop-shadow-[0_0_35px_rgba(36,195,127,0.4)]" />
        </div>
      </div>

      {/* Main Title */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-black mb-3 animate-slide-up leading-tight tracking-tight">
        <span className="text-gradient">Hifazat Dojo</span>
      </h1>

      <p className="text-navy-200 text-base sm:text-xl md:text-2xl mb-4 max-w-3xl animate-slide-up font-semibold tracking-wide">
        {getAppTitle()}
      </p>

      {/* Heroic Tagline Banner */}
      <div
        className="max-w-2xl mx-auto mb-6 p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-navy-900/90 via-navy-800/80 to-navy-900/90 border border-shield-500/30 shadow-xl shadow-shield-950/40 animate-slide-up"
        style={{ animationDelay: '0.1s' }}
      >
        <p className="text-shield-300 text-lg sm:text-2xl md:text-3xl font-black leading-snug">
          {isUrdu
            ? '“سکیم پہچانو، اپنی حفاظت کرو، اور کمیونٹی گارڈین بنو۔”'
            : '“Scam pehchano, apni hifazat karo, aur Community Guardian bano.”'}
        </p>
      </div>

      {/* Bilingual Selector Pills */}
      <div className="flex items-center gap-2 mb-8 animate-slide-up" style={{ animationDelay: '0.15s' }}>
        <button
          onClick={() => setLang('ur')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
            isUrdu
              ? 'bg-gradient-to-r from-shield-500 to-emerald-600 text-white shadow-lg shadow-shield-500/30 ring-2 ring-shield-300/50'
              : 'bg-navy-900/80 text-navy-300 hover:text-white border border-navy-700/60'
          }`}
        >
          <span>🇵🇰</span>
          <span className="font-urdu text-sm" dir="rtl">اردو (Urdu Mode)</span>
        </button>

        <button
          onClick={() => setLang('en')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
            !isUrdu
              ? 'bg-gradient-to-r from-shield-500 to-emerald-600 text-white shadow-lg shadow-shield-500/30 ring-2 ring-shield-300/50'
              : 'bg-navy-900/80 text-navy-300 hover:text-white border border-navy-700/60'
          }`}
        >
          <span>🇬🇧</span>
          <span>English Mode</span>
        </button>
      </div>

      {/* Core Action CTAs */}
      <div
        className="flex flex-col sm:flex-row gap-3 sm:gap-5 mb-10 w-full sm:w-auto justify-center animate-slide-up"
        style={{ animationDelay: '0.2s' }}
      >
        <Link to="/levels" className="btn-primary text-base sm:text-xl py-3.5 px-8">
          <span>🥋</span>
          <span>{isUrdu ? 'ڈوجو ٹریننگ شروع کریں' : 'Enter Dojo Challenge'}</span>
        </Link>
        <Link to="/about" className="btn-secondary text-base sm:text-lg">
          <span>🛡️</span>
          <span>{isUrdu ? 'حفاظتی اصول اور رہنمائی' : 'Security Guide & Rules'}</span>
        </Link>
        <Link to="/teacher" className="btn-secondary text-base sm:text-lg">
          <span>👨‍🏫</span>
          <span>{isUrdu ? 'اساتذہ ڈیش بورڈ' : 'Teacher Dashboard'}</span>
        </Link>
      </div>

      {/* 4 Pillars Stats Ticker */}
      <div
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl w-full mb-10 animate-slide-up"
        style={{ animationDelay: '0.25s' }}
      >
        <div className="card p-3 sm:p-4 text-center border-navy-700/60 bg-navy-900/60">
          <p className="text-2xl sm:text-3xl font-black text-shield-400">40</p>
          <p className="text-xs text-navy-300 font-semibold mt-1">
            {isUrdu ? 'فرضی منظرنامے' : 'Validated Scenarios'}
          </p>
        </div>
        <div className="card p-3 sm:p-4 text-center border-navy-700/60 bg-navy-900/60">
          <p className="text-2xl sm:text-3xl font-black text-emerald-400">4</p>
          <p className="text-xs text-navy-300 font-semibold mt-1">
            {isUrdu ? 'ڈوجو لیولز' : 'Mastery Belts'}
          </p>
        </div>
        <div className="card p-3 sm:p-4 text-center border-navy-700/60 bg-navy-900/60">
          <p className="text-2xl sm:text-3xl font-black text-amber-400">70%</p>
          <p className="text-xs text-navy-300 font-semibold mt-1">
            {isUrdu ? 'پاسنگ معیار' : 'Unlock Threshold'}
          </p>
        </div>
        <div className="card p-3 sm:p-4 text-center border-navy-700/60 bg-navy-900/60">
          <p className="text-2xl sm:text-3xl font-black text-cyan-400">100%</p>
          <p className="text-xs text-navy-300 font-semibold mt-1">
            {isUrdu ? 'محفوظ آف لائن' : 'Zero Data Risk'}
          </p>
        </div>
      </div>

      {/* Offline Notice & Prominent Safety Disclaimer */}
      <div className="max-w-2xl w-full animate-slide-up space-y-3 mb-12" style={{ animationDelay: '0.3s' }}>
        <div className="glass p-3.5 text-navy-300 text-xs sm:text-sm flex items-center justify-center gap-2">
          <span className="text-base">📴</span>
          <span>{getOfflineNotice()}</span>
        </div>
        <SafetyWarning />
      </div>

      {/* Exhibition Showcase: How the Dojo Works */}
      <div className="max-w-4xl w-full animate-slide-up" style={{ animationDelay: '0.35s' }}>
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px bg-gradient-to-r from-transparent via-shield-500/40 to-transparent w-24" />
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
            {isUrdu ? 'کھیل کے ۴ مراحل اور اصول' : 'The 4 Steps to Dojo Mastery'}
          </h2>
          <div className="h-px bg-gradient-to-r from-transparent via-shield-500/40 to-transparent w-24" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-left">
          {[
            {
              step: '01',
              icon: '📩',
              title_en: 'Analyze Simulator',
              title_ur: 'پیغام کا تجزیہ',
              en: 'Read realistic SMS, WhatsApp, call, or email simulations.',
              ur: 'فرضی پیغام، کال یا لنک کا منظر غور سے پڑھیں۔',
            },
            {
              step: '02',
              icon: '⚖️',
              title_en: 'Make Decision',
              title_ur: 'فیصلہ کریں',
              en: 'Assess digital indicators: Is it Safe or a Scam?',
              ur: 'صرف ایک کلک میں فیصلہ کریں: محفوظ ہے یا سکیم؟',
            },
            {
              step: '03',
              icon: '💡',
              title_en: 'Dojo Intelligence',
              title_ur: 'حفاظتی حکمت',
              en: 'Gain points, hints, and actionable community habits.',
              ur: 'پوائنٹس حاصل کریں اور عملی حفاظتی عادات سیکھیں۔',
            },
            {
              step: '04',
              icon: '🏅',
              title_en: 'Claim Honors',
              title_ur: 'سرٹیفکیٹ اور بیج',
              en: 'Unlock belts and earn the Community Guardian credential.',
              ur: '۷۰٪ سے اگلا لیول کھولیں اور سرٹیفکیٹ لیں۔',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="card relative overflow-hidden group hover:border-shield-500/50 hover:bg-navy-800/80 transition-all p-4"
            >
              <div className="absolute top-2 right-3 font-mono font-black text-2xl text-navy-800/80 group-hover:text-shield-500/20 transition-colors">
                {item.step}
              </div>
              <span className="text-3xl block mb-2">{item.icon}</span>
              <h3 className="text-sm font-bold text-white mb-1">
                {isUrdu ? item.title_ur : item.title_en}
              </h3>
              <p className={`text-navy-300 text-xs leading-relaxed ${isUrdu ? 'text-right font-urdu' : ''}`}>
                {isUrdu ? item.ur : item.en}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
