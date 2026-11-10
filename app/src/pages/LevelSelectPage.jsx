import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useGame, useGameDispatch } from '../store/GameContext';
import { LEVELS } from '../data/questions';

export default function LevelSelectPage() {
  const { language, unlockedLevels, completedLevels, levelScores, practiceMode } = useGame();
  const dispatch = useGameDispatch();
  const navigate = useNavigate();
  const isUrdu = language === 'ur';

  if (!language) {
    return <Navigate to="/language" replace />;
  }

  function handleStartLevel(levelId) {
    dispatch({ type: 'START_LEVEL', payload: levelId });
    navigate(`/quiz/${levelId}`);
  }

  function togglePracticeMode() {
    dispatch({ type: 'TOGGLE_PRACTICE_MODE' });
  }

  const difficultyStars = {
    1: '★☆☆☆',
    2: '★★☆☆',
    3: '★★★☆',
    4: '★★★★',
  };

  const beltNames = {
    1: { en: 'Green Belt • Novice Scout', ur: 'سبز بیلٹ • بنیادی محافظ' },
    2: { en: 'Blue Belt • Threat Hunter', ur: 'نیلی بیلٹ • خطرہ شناس' },
    3: { en: 'Purple Belt • Cyber Sentinel', ur: 'جامنی بیلٹ • سائبر نگران' },
    4: { en: 'Black Belt • Grandmaster Guardian', ur: 'بلیک بیلٹ • کمیونٹی گارڈین' },
  };

  return (
    <div className={`page-container ${isUrdu ? 'rtl' : ''}`}>
      {/* Page Header */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="badge-pill bg-navy-900 text-shield-400 border-shield-500/30 mb-3 shadow">
          <span>🥋</span>
          <span>Dojo Progression Path</span>
          <span className="text-navy-500">•</span>
          <span>70% Accuracy to Unlock</span>
        </div>

        <h1 className="section-title text-3xl sm:text-5xl font-black">
          {isUrdu ? '🏯 ڈوجو درجات اور چیلنج لیولز' : '🏯 Dojo Mastery Stages'}
        </h1>

        <p className="text-navy-200 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          {isUrdu
            ? 'ہر ڈوجو لیول میں ۱۰ چیلنجز ہیں۔ اگلا لیول کھولنے کے لیے کم از کم ۷ درست فیصلے درکار ہیں۔'
            : 'Each stage contains 10 realistic simulations. Score 70% or higher to advance your rank and unlock the next tier.'}
        </p>
      </div>

      {/* Teacher Practice Mode Toggle Bar */}
      <div
        className="max-w-3xl mx-auto mb-8 p-3.5 sm:p-4 rounded-2xl border backdrop-blur-xl shadow-xl transition-all duration-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm"
        style={{
          backgroundColor: practiceMode ? 'rgba(76, 29, 149, 0.35)' : 'rgba(16, 33, 66, 0.65)',
          borderColor: practiceMode ? 'rgba(192, 132, 252, 0.6)' : 'rgba(41, 78, 142, 0.5)',
        }}
      >
        <div className="flex items-center gap-3 text-left w-full sm:w-auto">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
              practiceMode ? 'bg-purple-600/40 text-purple-200 border border-purple-400/50 animate-pulse' : 'bg-navy-800 text-navy-400 border border-navy-700'
            }`}
          >
            {practiceMode ? '🔓' : '🔒'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-sm sm:text-base">
                {practiceMode
                  ? (isUrdu ? 'اساتذہ پریکٹس موڈ فعال ہے' : 'Teacher Practice Mode: ACTIVE')
                  : (isUrdu ? 'طلباء پروگریشن موڈ' : 'Student Progression Mode')}
              </span>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  practiceMode
                    ? 'bg-purple-500/30 text-purple-200 border border-purple-400/50'
                    : 'bg-navy-800 text-navy-400 border border-navy-700'
                }`}
              >
                {practiceMode ? 'All Levels Unlocked' : '70% Required'}
              </span>
            </div>
            <p className="text-navy-300 text-xs mt-0.5">
              {practiceMode
                ? (isUrdu
                    ? 'کلاس میں مظاہرے کے لیے تمام ۴ لیولز کھول دیے گئے ہیں۔'
                    : 'All 4 levels unlocked for classroom demonstration, teaching & exhibition testing.')
                : (isUrdu
                    ? 'اساتذہ اور نمائش کے لیے تمام ۴ لیولز بغیر ٹیسٹ کے کھولنے کے لیے یہ موڈ آن کریں۔'
                    : 'Enable Practice Mode to test and demonstrate any level without passing earlier stages.')}
            </p>
          </div>
        </div>

        <button
          onClick={togglePracticeMode}
          className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs sm:text-sm font-black cursor-pointer transition-all duration-200 whitespace-nowrap shadow-md flex items-center justify-center gap-1.5 ${
            practiceMode
              ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-900/50 ring-2 ring-purple-300/40'
              : 'bg-navy-800 hover:bg-navy-700 text-shield-300 border border-shield-500/40'
          }`}
        >
          <span>{practiceMode ? '🔒' : '👨‍🏫'}</span>
          <span>
            {practiceMode
              ? (isUrdu ? 'پریکٹس موڈ بند کریں' : 'Turn OFF Practice Mode')
              : (isUrdu ? 'پریکٹس موڈ آن کریں (تمام لیولز)' : 'Enable Practice Mode')}
          </span>
        </button>
      </div>

      {/* Grid of Dojo Level Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-4xl mx-auto mb-12">
        {LEVELS.map((level) => {
          const normallyUnlocked = unlockedLevels.includes(level.id);
          const unlocked = normallyUnlocked || practiceMode;
          const unlockedByPractice = practiceMode && !normallyUnlocked;
          const completed = completedLevels.includes(level.id);
          const score = levelScores[level.id];
          const belt = beltNames[level.id];

          return (
            <div
              key={level.id}
              className={`card relative overflow-hidden transition-all duration-300 ${
                unlocked
                  ? 'hover:border-shield-400/60 hover:shadow-2xl hover:shadow-shield-500/10 hover:-translate-y-1'
                  : 'opacity-55 bg-navy-950/70 border-navy-800 cursor-not-allowed'
              } ${completed ? 'border-shield-500/60 ring-1 ring-shield-500/30 bg-gradient-to-br from-navy-900/90 to-navy-950/90' : ''} ${
                unlockedByPractice ? 'ring-1 ring-purple-500/40 border-purple-500/40' : ''
              }`}
            >
              {/* Vibrant Top Stripe */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${level.color}`} />

              <div className="flex items-start gap-4 pt-2">
                {/* Large Level Badge Avatar */}
                <div
                  className={`text-4xl p-3 rounded-2xl flex-shrink-0 shadow-lg ${
                    completed
                      ? 'bg-gradient-to-br from-shield-500/20 to-emerald-500/10 border border-shield-500/40'
                      : unlockedByPractice
                      ? 'bg-purple-900/30 border border-purple-500/40'
                      : unlocked
                      ? 'bg-navy-800/90 border border-navy-700/80'
                      : 'bg-navy-950/80 border border-navy-800'
                  }`}
                >
                  {unlocked ? level.icon : '🔒'}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Belt rank & Stars */}
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[11px] font-bold text-shield-400 tracking-wider uppercase font-mono">
                      {isUrdu ? belt.ur : belt.en}
                    </span>
                    <span className="text-amber-400 text-xs font-mono tracking-widest" title="Difficulty">
                      {difficultyStars[level.id]}
                    </span>
                  </div>

                  {/* Level Name & Cleared Badge */}
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      {isUrdu ? level.name_ur : level.name_en}
                    </h2>
                    {completed && (
                      <span className="text-[11px] bg-shield-500/20 text-shield-300 border border-shield-400/50 px-2.5 py-0.5 rounded-full font-extrabold flex items-center gap-1 shadow-sm">
                        <span>✓</span>
                        <span>{isUrdu ? 'مکمل' : 'Passed'}</span>
                      </span>
                    )}
                    {unlockedByPractice && (
                      <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-400/40 px-2 py-0.5 rounded font-mono font-bold">
                        👨‍🏫 Practice Unlocked
                      </span>
                    )}
                  </div>

                  {/* Target Audience */}
                  <p className="text-navy-300 text-xs sm:text-sm mb-3 font-medium">
                    {isUrdu ? level.subtitle_ur : level.subtitle_en}
                  </p>

                  {/* Theme & Official Badge Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-navy-200 mb-4">
                    <span className="bg-navy-950/70 border border-navy-700/70 px-2.5 py-1 rounded-lg">
                      🎯 {isUrdu ? level.theme_ur : level.theme_en}
                    </span>
                    <span className="bg-navy-950/70 border border-navy-700/70 px-2.5 py-1 rounded-lg font-semibold text-shield-300">
                      🏅 {isUrdu ? level.badge_ur : level.badge_en}
                    </span>
                  </div>

                  {/* High Score Snapshot */}
                  {score && (
                    <div className="flex items-center justify-between text-xs bg-navy-950/80 border border-navy-800 p-2.5 rounded-xl mb-4">
                      <div>
                        <span className="text-navy-400">{isUrdu ? 'اعلیٰ ترین سکور: ' : 'Best Score: '}</span>
                        <strong className="text-shield-400 text-sm font-black">{score.score}/100</strong>
                      </div>
                      <div className="text-navy-300">
                        <span>{isUrdu ? 'درست جوابات: ' : 'Accuracy: '}</span>
                        <strong className="text-white">{score.correct}/10</strong>
                      </div>
                    </div>
                  )}

                  {/* Action Controls */}
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    {unlocked ? (
                      <>
                        <button
                          onClick={() => handleStartLevel(level.id)}
                          className={`btn-primary text-xs sm:text-sm py-2 px-5 ${
                            completed ? 'bg-navy-800 hover:bg-navy-700 border border-navy-600' : ''
                          }`}
                        >
                          {completed
                            ? (isUrdu ? '🔄 دوبارہ مشق کریں' : '🔄 Practice Again')
                            : (isUrdu ? '▶️ چیلنج شروع کریں' : '▶️ Begin Challenge')}
                        </button>
                        {(completed || practiceMode) && (
                          <Link
                            to={`/certificate/${level.id}`}
                            className="btn-secondary text-xs sm:text-sm py-2 px-3 border-shield-500/40 text-shield-300"
                          >
                            📜 {isUrdu ? 'سرٹیفکیٹ' : 'Certificate'}
                          </Link>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center gap-1.5 text-navy-400 text-xs italic bg-navy-950/60 px-3 py-2 rounded-lg border border-navy-800 w-full">
                        <span>🔒</span>
                        <span>
                          {isUrdu
                            ? `پہلے لیول ${level.id - 1} میں ۷۰٪ سکور کر کے یہ رینک کھولیں (یا اوپر پریکٹس موڈ آن کریں)`
                            : `Score 70% in Level ${level.id - 1} to unlock this tier (or enable Practice Mode above)`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ultimate Grandmaster Community Guardian Showcase */}
      {(completedLevels.length === 4 || practiceMode) && (
        <div className="text-center animate-slide-up mb-10 max-w-2xl mx-auto">
          <div className="card-glow p-6 sm:p-10 border-amber-400/50 bg-gradient-to-b from-navy-900 via-navy-950 to-navy-900 shadow-2xl shadow-amber-500/10">
            <div className="text-6xl sm:text-7xl mb-3 animate-float">🏆</div>
            <div className="badge-pill bg-amber-950/80 text-amber-300 border-amber-400/50 mb-3">
              <span>National STREAM Project Honors</span>
              {practiceMode && completedLevels.length < 4 && (
                <span className="text-purple-300 font-mono text-[10px] ml-1">(Practice Preview)</span>
              )}
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-gradient-gold mb-3">
              {isUrdu ? 'اعلیٰ ترین اعزاز: کمیونٹی گارڈین!' : 'Hifazat Dojo Community Guardian!'}
            </h2>
            <p className="text-navy-200 text-sm sm:text-base mb-6 leading-relaxed">
              {isUrdu
                ? 'آپ کی سائبر آگاہی اور حفاظتی شعور نمایاں ہے۔ اپنا قومی STREAM ماسٹر سرٹیفکیٹ حاصل کریں۔'
                : 'Master Diploma credential for digital defense. You hold the digital instincts to safeguard your family and neighborhood.'}
            </p>
            <Link to="/certificate/final" className="btn-primary text-base sm:text-lg py-3 px-8 shadow-xl shadow-amber-500/20">
              📜 {isUrdu ? 'مکمل کمیونٹی گارڈین ڈپلوما دیکھیں' : 'View Master Honors Diploma'}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
