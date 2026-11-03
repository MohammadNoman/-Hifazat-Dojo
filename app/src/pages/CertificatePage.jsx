import { useParams, Link, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { useGame, useGameDispatch } from '../store/GameContext';
import { LEVELS } from '../data/questions';
import ShieldIcon from '../components/ShieldIcon';

export default function CertificatePage() {
  const { levelId } = useParams();
  const { language, learnerName, levelScores, completedLevels } = useGame();
  const dispatch = useGameDispatch();
  const isUrdu = language === 'ur';

  const [name, setName] = useState(learnerName || '');
  const [submitted, setSubmitted] = useState(!!learnerName);

  const isFinal = levelId === 'final';
  const levelNum = isFinal ? null : parseInt(levelId, 10);
  const level = isFinal ? null : LEVELS.find((l) => l.id === levelNum);

  // Declarative navigation guards
  if (isFinal && completedLevels.length < 4) {
    return <Navigate to="/levels" replace />;
  }
  if (!isFinal && (!level || (!completedLevels.includes(levelNum) && !levelScores[levelNum]?.passed))) {
    return <Navigate to="/levels" replace />;
  }

  const scoreData = isFinal ? null : levelScores[levelNum];
  const dateStr = scoreData?.date
    ? new Date(scoreData.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  function handleGenerate(e) {
    e?.preventDefault();
    const trimmed = name.trim();
    if (trimmed) {
      dispatch({ type: 'SET_LEARNER_NAME', payload: trimmed });
      setSubmitted(true);
    }
  }

  function handlePrint() {
    window.print();
  }

  // Name Entry Modal / View
  if (!submitted) {
    return (
      <div className={`page-container max-w-md ${isUrdu ? 'rtl' : ''}`}>
        <div className="card text-center p-6 sm:p-8 mt-6 sm:mt-12 animate-fade-in border-shield-500/40">
          <div className="text-5xl mb-3">📜</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            {isUrdu ? 'سرٹیفکیٹ برائے طالب علم' : 'Student Certificate'}
          </h1>
          <p className="text-navy-300 text-sm mb-6">
            {isUrdu
              ? 'سرٹیفکیٹ پر پرنٹ کرنے کے لیے اپنا مکمل نام درج کریں:'
              : 'Enter the learner’s full name to personalize the award certificate:'}
          </p>

          <form onSubmit={handleGenerate} className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isUrdu ? 'طالب علم کا نام درج کریں' : 'e.g. Ayesha Khan'}
              className="w-full bg-navy-900 border border-navy-600 rounded-xl px-4 py-3 text-white text-base sm:text-lg text-center font-bold focus:outline-none focus:ring-2 focus:ring-shield-400"
              maxLength={60}
              autoFocus
              dir="auto"
            />
            <button
              type="submit"
              disabled={!name.trim()}
              className="btn-primary w-full disabled:opacity-40"
            >
              {isUrdu ? 'سرٹیفکیٹ جاری کریں 🎓' : 'Generate Certificate 🎓'}
            </button>
          </form>

          <p className="text-xs text-navy-400 mt-4">
            🔒 {isUrdu ? 'نام صرف آپ کے کمپیوٹر پر محفوظ ہوتا ہے، کسی سرور پر نہیں جاتا۔' : '100% Private. Name is stored locally on this device only.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container max-w-4xl">
      {/* Control Actions (Hidden on Print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 mb-6 bg-navy-900/60 p-4 rounded-xl border border-navy-700/60">
        <div>
          <span className="text-xs sm:text-sm text-navy-300">
            Learner: <strong className="text-white">{name}</strong>
          </span>
          <button
            onClick={() => setSubmitted(false)}
            className="ml-3 text-xs text-shield-400 underline hover:text-shield-300 cursor-pointer"
          >
            {isUrdu ? 'نام تبدیل کریں' : 'Edit Name'}
          </button>
        </div>

        <div className="flex gap-2">
          <button onClick={handlePrint} className="btn-primary text-sm py-2 px-4 sm:px-6">
            🖨️ {isUrdu ? 'پرنٹ / پی ڈی ایف محفوظ کریں' : 'Print / Save PDF'}
          </button>
          <Link to="/levels" className="btn-secondary text-sm py-2 px-4">
            {isUrdu ? '← ڈوجو لیولز' : '← Dojo Levels'}
          </Link>
        </div>
      </div>

      {/* Printable Certificate Frame */}
      <div className="certificate-container bg-white text-navy-950 rounded-2xl p-6 sm:p-10 md:p-14 border-4 sm:border-8 border-navy-900 relative overflow-hidden shadow-2xl">
        {/* Ornate Corner Accents */}
        <div className="absolute top-0 left-0 w-16 sm:w-24 h-16 sm:h-24 border-t-4 border-l-4 border-shield-600 rounded-tl-xl m-2" />
        <div className="absolute top-0 right-0 w-16 sm:w-24 h-16 sm:h-24 border-t-4 border-r-4 border-shield-600 rounded-tr-xl m-2" />
        <div className="absolute bottom-0 left-0 w-16 sm:w-24 h-16 sm:h-24 border-b-4 border-l-4 border-shield-600 rounded-bl-xl m-2" />
        <div className="absolute bottom-0 right-0 w-16 sm:w-24 h-16 sm:h-24 border-b-4 border-r-4 border-shield-600 rounded-br-xl m-2" />

        <div className="text-center relative z-10 py-2 sm:py-4">
          {/* Organization Emblem */}
          <div className="flex justify-center mb-3">
            <ShieldIcon size={70} className="drop-shadow-md" />
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-navy-900 tracking-wider mb-1">
            HIFAZAT DOJO
          </h1>
          <p className="text-xs sm:text-sm font-bold text-navy-600 tracking-widest uppercase mb-4">
            Cybersecurity & Scam Awareness — STREAM Project
          </p>

          <div className="w-24 sm:w-40 h-1 bg-gradient-to-r from-transparent via-shield-500 to-transparent mx-auto mb-5" />

          <p className="text-navy-500 text-sm sm:text-base italic mb-1">
            This certificate of recognition is proudly awarded to
          </p>

          {/* Student Name */}
          <h2 className="text-2xl sm:text-4xl font-black text-navy-900 my-2 sm:my-3 border-b-2 border-shield-500 pb-1 inline-block px-6 sm:px-12">
            {name}
          </h2>

          <p className="text-navy-600 text-sm sm:text-base my-2">
            for outstanding achievement and mastery in digital scam detection:
          </p>

          {/* Award Specifics */}
          {isFinal ? (
            <div className="my-4 py-3 bg-amber-50 rounded-xl border border-amber-300 max-w-lg mx-auto">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
                🏆 Ultimate Dojo Mastery
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-navy-900">
                Hifazat Dojo Community Guardian
              </h3>
              <p className="text-xs text-navy-600 mt-1">
                Completed All 4 Stages: Password Safety • Phishing • Money Scams • Community Reporting
              </p>
            </div>
          ) : (
            <div className="my-4 py-3 bg-shield-50 rounded-xl border border-shield-300 max-w-lg mx-auto">
              <h3 className="text-lg sm:text-2xl font-extrabold text-navy-900 mb-1">
                {level.icon} {level.name_en}
              </h3>
              <p className="text-xs sm:text-sm text-navy-700">
                Score: <strong className="text-shield-700">{scoreData?.score || 100}/100</strong>
                {' • '}
                Accuracy: <strong className="text-navy-900">{scoreData?.correct || 10}/10</strong>
              </p>
              <p className="text-xs sm:text-sm font-bold text-shield-800 mt-1">
                🏅 Awarded Badge: {level.badge_en}
              </p>
            </div>
          )}

          {/* Signature & Date Grid */}
          <div className="grid grid-cols-2 gap-8 max-w-md mx-auto mt-6 sm:mt-10 pt-4 border-t border-navy-200 text-xs sm:text-sm">
            <div>
              <p className="font-bold text-navy-800">{dateStr}</p>
              <p className="text-navy-500 text-xs">Date of Issue</p>
            </div>
            <div>
              <p className="font-bold text-shield-700">Verified Dojo Seal</p>
              <p className="text-navy-500 text-xs">STREAM School Exhibition</p>
            </div>
          </div>

          <p className="text-[10px] sm:text-xs text-navy-400 mt-6 tracking-tight">
            Authentication ID: HD-{Date.now().toString(36).toUpperCase()} • Verified Static Safe Educational Tool
          </p>
        </div>
      </div>
    </div>
  );
}
