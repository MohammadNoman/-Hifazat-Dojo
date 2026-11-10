import { useParams, Link, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { useGame, useGameDispatch } from '../store/GameContext';
import { LEVELS } from '../data/questions';
import ShieldIcon from '../components/ShieldIcon';

export default function CertificatePage() {
  const { levelId } = useParams();
  const { language, learnerName, levelScores, completedLevels, practiceMode } = useGame();
  const dispatch = useGameDispatch();
  const isUrdu = language === 'ur';

  const [name, setName] = useState(learnerName || '');
  const [submitted, setSubmitted] = useState(!!learnerName);

  const isFinal = levelId === 'final';
  const levelNum = isFinal ? null : parseInt(levelId, 10);
  const level = isFinal ? null : LEVELS.find((l) => l.id === levelNum);

  // Declarative navigation guards (bypassed in Teacher Practice Mode for exhibition demonstration)
  if (!practiceMode && isFinal && completedLevels.length < 4) {
    return <Navigate to="/levels" replace />;
  }
  if (!practiceMode && !isFinal && (!level || (!completedLevels.includes(levelNum) && !levelScores[levelNum]?.passed))) {
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
            {isUrdu ? 'سرٹیفکیٹ برائے طالب علم' : 'Student Certificate Entry'}
          </h1>
          <p className="text-navy-300 text-xs sm:text-sm mb-6">
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
              className="btn-primary w-full disabled:opacity-40 cursor-pointer"
            >
              {isUrdu ? 'سرٹیفکیٹ جاری کریں 🎓' : 'Issue Certificate 🎓'}
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
      <div className="no-print flex flex-wrap items-center justify-between gap-3 mb-6 bg-navy-900/80 p-4 rounded-xl border border-navy-700/80 shadow-lg">
        <div>
          <span className="text-xs sm:text-sm text-navy-300">
            Learner: <strong className="text-white">{name}</strong>
          </span>
          <button
            onClick={() => setSubmitted(false)}
            className="ml-3 text-xs text-shield-400 underline hover:text-shield-300 cursor-pointer"
          >
            {isUrdu ? 'نام تبدیل کریں' : 'Change Name'}
          </button>
        </div>

        <div className="flex gap-2.5">
          <button onClick={handlePrint} className="btn-primary text-xs sm:text-sm py-2 px-4 sm:px-6 shadow-md">
            🖨️ {isUrdu ? 'پرنٹ / پی ڈی ایف محفوظ کریں' : 'Print / Save Official PDF'}
          </button>
          <Link to="/levels" className="btn-secondary text-xs sm:text-sm py-2 px-4">
            {isUrdu ? '← ڈوجو لیولز' : '← Dojo Stages'}
          </Link>
        </div>
      </div>

      {/* Museum / Diploma Grade Certificate Frame */}
      <div className="certificate-container bg-[#fffefc] text-navy-950 rounded-2xl p-6 sm:p-10 md:p-14 border-[6px] sm:border-[10px] border-[#102142] relative overflow-hidden shadow-2xl">
        {/* Ornate Vintage Double Border */}
        <div className="absolute inset-2 sm:inset-3 border-2 border-[#b8860b]/60 pointer-events-none rounded-lg" />
        <div className="absolute inset-4 sm:inset-5 border border-[#102142]/20 pointer-events-none rounded" />

        {/* Traditional Corner Flourishes */}
        <div className="absolute top-5 left-5 w-8 h-8 border-t-2 border-l-2 border-[#b8860b]" />
        <div className="absolute top-5 right-5 w-8 h-8 border-t-2 border-r-2 border-[#b8860b]" />
        <div className="absolute bottom-5 left-5 w-8 h-8 border-b-2 border-l-2 border-[#b8860b]" />
        <div className="absolute bottom-5 right-5 w-8 h-8 border-b-2 border-r-2 border-[#b8860b]" />

        {/* Faint Watermark Shield in Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none">
          <ShieldIcon size={380} />
        </div>

        <div className="text-center relative z-10 py-1 sm:py-2">
          {/* Top Organization Header */}
          <div className="flex justify-center mb-3">
            <div className="relative">
              <ShieldIcon size={64} className="drop-shadow-md" />
            </div>
          </div>

          <p className="text-[11px] sm:text-xs font-black tracking-[0.25em] text-[#b8860b] uppercase mb-1">
            NATIONAL SCHOOL STREAM EXHIBITION 2026
          </p>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#102142] tracking-wider mb-1 font-serif">
            HIFAZAT DOJO
          </h1>

          <p className="text-xs sm:text-sm font-bold text-navy-700 tracking-widest uppercase mb-4">
            Certificate of Digital Defense & Scam Awareness
          </p>

          <div className="w-28 sm:w-44 h-1 bg-gradient-to-r from-transparent via-[#b8860b] to-transparent mx-auto mb-4" />

          <p className="text-navy-600 text-xs sm:text-sm italic mb-1 font-serif">
            This certifies that the candidate
          </p>

          {/* Student Name */}
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#102142] my-2 sm:my-3 border-b-2 border-[#b8860b] pb-1 inline-block px-8 sm:px-14 tracking-tight font-serif">
            {name}
          </h2>

          <p className="text-navy-700 text-xs sm:text-sm my-2 max-w-lg mx-auto">
            has demonstrated exceptional competence in identifying phishing attacks, OTP fraud, and digital impersonation:
          </p>

          {/* Distinction Banner */}
          {isFinal ? (
            <div className="my-4 py-3 sm:py-4 px-6 bg-amber-50/80 rounded-xl border border-amber-300 max-w-lg mx-auto shadow-sm">
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-amber-800 mb-0.5">
                🏆 HIGHEST DISTINCTION • ALL 4 LEVELS MASTERED
              </p>
              <h3 className="text-xl sm:text-3xl font-black text-[#102142] font-serif">
                Hifazat Dojo Community Guardian
              </h3>
              <p className="text-xs text-navy-600 mt-1">
                Authorized Peer Educator & Community Cyber Sentinel
              </p>
            </div>
          ) : (
            <div className="my-4 py-3 px-6 bg-emerald-50/70 rounded-xl border border-emerald-300 max-w-md mx-auto shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 mb-0.5">
                STAGE MASTERY COMPLETED
              </p>
              <h3 className="text-lg sm:text-2xl font-black text-[#102142] font-serif">
                {level.icon} {level.name_en}
              </h3>
              <p className="text-xs text-navy-700 mt-1">
                Score: <strong className="text-emerald-800">{scoreData?.score || 100}/100</strong>
                {' • '}
                Accuracy: <strong className="text-[#102142]">{scoreData?.correct || 10}/10 Correct</strong>
              </p>
              <p className="text-xs font-bold text-[#b8860b] mt-0.5">
                🏅 Awarded Title: {level.badge_en}
              </p>
            </div>
          )}

          {/* Authentic Rosette Seal & Signatures Grid */}
          <div className="grid grid-cols-3 items-end gap-4 max-w-xl mx-auto mt-6 sm:mt-8 pt-4 border-t border-navy-200 text-xs">
            {/* Left Signature */}
            <div className="text-center">
              <div className="h-8 border-b border-navy-400 mx-auto w-24 mb-1 font-serif italic text-navy-600 text-sm">
                N. Ahmad
              </div>
              <p className="font-bold text-[#102142]">Cyber Lead Instructor</p>
              <p className="text-[10px] text-navy-500">STREAM Training Dept</p>
            </div>

            {/* Center Golden Rosette Seal */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-full border-2 border-dashed border-[#b8860b] bg-amber-50 flex items-center justify-center shadow-inner">
                <span className="text-xl sm:text-2xl">🎖️</span>
              </div>
              <span className="text-[9px] font-mono font-bold text-[#b8860b] uppercase tracking-wider mt-1">
                OFFICIAL SEAL
              </span>
            </div>

            {/* Right Signature */}
            <div className="text-center">
              <div className="h-8 border-b border-navy-400 mx-auto w-24 mb-1 font-serif italic text-navy-600 text-sm">
                {dateStr}
              </div>
              <p className="font-bold text-[#102142]">Date of Issue</p>
              <p className="text-[10px] text-navy-500">Exhibition Record</p>
            </div>
          </div>

          <p className="text-[9px] sm:text-[10px] text-navy-400 mt-5 font-mono tracking-tight">
            Document Verification ID: HD-{Date.now().toString(36).toUpperCase()}-STREAM • 100% Client-Side Verified
          </p>
        </div>
      </div>
    </div>
  );
}
