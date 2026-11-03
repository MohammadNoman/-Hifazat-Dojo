import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useGame, useGameDispatch } from '../store/GameContext';
import { LEVELS } from '../data/questions';

export default function LevelSelectPage() {
  const { language, unlockedLevels, completedLevels, levelScores } = useGame();
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
      <div className="text-center mb-8 sm:mb-12">
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

      {/* Grid of Dojo Level Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-4xl mx-auto mb-12">
        {LEVELS.map((level) => {
          const unlocked = unlockedLevels.includes(level.id);
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
              } ${completed ? 'border-shield-500/60 ring-1 ring-shield-500/30 bg-gradient-to-br from-navy-900/90 to-navy-950/90' : ''}`}
            >
              {/* Vibrant Top Stripe */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${level.color}`} />

              <div className="flex items-start gap-4 pt-2">
                {/* Large Level Badge Avatar */}
                <div
                  className={`text-4xl p-3 rounded-2xl flex-shrink-0 shadow-lg ${
                    completed
                      ? 'bg-gradient-to-br from-shield-500/20 to-emerald-500/10 border border-shield-500/40'
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
                        {completed && (
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
                            ? `پہلے لیول ${level.id - 1} میں ۷۰٪ سکور کر کے یہ رینک کھولیں`
                            : `Score 70% in Level ${level.id - 1} to unlock this tier`}
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
      {completedLevels.length === 4 && (
        <div className="text-center animate-slide-up mb-10 max-w-2xl mx-auto">
          <div className="card-glow p-6 sm:p-10 border-amber-400/50 bg-gradient-to-b from-navy-900 via-navy-950 to-navy-900 shadow-2xl shadow-amber-500/10">
            <div className="text-6xl sm:text-7xl mb-3 animate-float">🏆</div>
            <div className="badge-pill bg-amber-950/80 text-amber-300 border-amber-400/50 mb-3">
              <span>National STREAM Project Honors</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-gradient-gold mb-3">
              {isUrdu ? 'اعلیٰ ترین اعزاز: کمیونٹی گارڈین!' : 'Hifazat Dojo Community Guardian!'}
            </h2>
            <p className="text-navy-200 text-sm sm:text-base mb-6 leading-relaxed">
              {isUrdu
                ? 'مبارک ہو! آپ نے تمام ۴ درجات کامیابی سے فتح کر لیے ہیں۔ آپ کی سائبر آگاہی اور حفاظتی شعور نمایاں ہے۔ اپنا قومی STREAM ماسٹر سرٹیفکیٹ حاصل کریں۔'
                : 'Congratulations! You have mastered all four Dojo stages. You now hold the digital instincts to safeguard your family and neighborhood. Claim your Master Diploma!'}
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
