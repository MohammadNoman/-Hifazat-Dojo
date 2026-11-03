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

  return (
    <div className={`page-container ${isUrdu ? 'rtl' : ''}`}>
      {/* Title */}
      <div className="text-center mb-8 sm:mb-10">
        <h1 className="section-title">
          {isUrdu ? '🏯 ڈوجو لیولز کا انتخاب' : '🏯 Choose Your Dojo Level'}
        </h1>
        <p className="text-navy-300 text-sm sm:text-base max-w-xl mx-auto">
          {isUrdu
            ? 'ہر لیول پاس کرنے اور اگلا لیول کھولنے کے لیے ۱۰ میں سے کم از کم ۷ (۷۰٪) سوالات کا درست جواب دینا ضروری ہے۔'
            : 'Answer at least 7 out of 10 questions correctly (70%) to master each stage and unlock the next Dojo.'}
        </p>
      </div>

      {/* Grid of 4 Levels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto mb-10">
        {LEVELS.map((level) => {
          const unlocked = unlockedLevels.includes(level.id);
          const completed = completedLevels.includes(level.id);
          const score = levelScores[level.id];

          return (
            <div
              key={level.id}
              className={`card relative overflow-hidden transition-all duration-200 ${
                unlocked
                  ? 'hover:ring-2 hover:ring-shield-400/50 hover:bg-navy-800/90'
                  : 'opacity-55 bg-navy-900/50 border-navy-800'
              } ${completed ? 'ring-1 ring-shield-500/40' : ''}`}
            >
              {/* Level gradient stripe */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${level.color}`} />

              <div className="flex items-start gap-3 sm:gap-4 pt-2">
                <div className="text-3xl sm:text-4xl p-2 rounded-xl bg-navy-900/80 flex-shrink-0">
                  {unlocked ? level.icon : '🔒'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                      {isUrdu ? level.name_ur : level.name_en}
                    </h2>
                    {completed && (
                      <span className="text-xs bg-shield-500/20 text-shield-300 border border-shield-500/40 px-2 py-0.5 rounded-full font-bold">
                        ✅ {isUrdu ? 'مکمل' : 'Cleared'}
                      </span>
                    )}
                  </div>

                  <p className="text-navy-300 text-xs sm:text-sm mb-2">
                    {isUrdu ? level.subtitle_ur : level.subtitle_en}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-navy-400 mb-3">
                    <span className="bg-navy-900/60 px-2 py-1 rounded">
                      🎯 {isUrdu ? level.theme_ur : level.theme_en}
                    </span>
                    <span className="bg-navy-900/60 px-2 py-1 rounded">
                      🏅 {isUrdu ? level.badge_ur : level.badge_en}
                    </span>
                  </div>

                  {score && (
                    <div className="flex items-center gap-3 mb-3 text-xs sm:text-sm bg-navy-900/40 p-2 rounded-lg">
                      <span className="text-shield-400 font-bold">
                        {isUrdu ? `بہترین سکور: ${score.score}/100` : `Best Score: ${score.score}/100`}
                      </span>
                      <span className="text-navy-300">
                        {isUrdu ? `درست: ${score.correct}/10` : `Correct: ${score.correct}/10`}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    {unlocked ? (
                      <>
                        <button
                          onClick={() => handleStartLevel(level.id)}
                          className={`btn-primary text-xs sm:text-sm py-2 px-4 sm:px-5 ${
                            completed ? 'bg-navy-700 hover:bg-navy-600 border border-navy-500' : ''
                          }`}
                        >
                          {completed
                            ? (isUrdu ? '🔄 دوبارہ کھیلیں' : '🔄 Play Again')
                            : (isUrdu ? '▶️ لیول شروع کریں' : '▶️ Start Level')}
                        </button>
                        {completed && (
                          <Link
                            to={`/certificate/${level.id}`}
                            className="btn-secondary text-xs sm:text-sm py-2 px-3"
                          >
                            📜 {isUrdu ? 'سرٹیفکیٹ' : 'Certificate'}
                          </Link>
                        )}
                      </>
                    ) : (
                      <p className="text-navy-500 text-xs sm:text-sm italic">
                        {isUrdu
                          ? `🔒 پہلے لیول ${level.id - 1} میں ۷۰٪ سکور کر کے ان لاک کریں`
                          : `🔒 Score 70% in Level ${level.id - 1} to unlock`}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ultimate Community Guardian Achievement (All 4 Levels Completed) */}
      {completedLevels.length === 4 && (
        <div className="text-center animate-slide-up mb-10">
          <div className="card-glow max-w-lg mx-auto p-6 sm:p-8 border-amber-500/40 bg-gradient-to-b from-navy-800 to-navy-900">
            <div className="text-5xl sm:text-6xl mb-3">🏆</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-300 mb-2">
              {isUrdu ? 'مبارک ہو! کمیونٹی گارڈین' : 'Community Guardian Achieved!'}
            </h2>
            <p className="text-navy-200 text-sm sm:text-base mb-6">
              {isUrdu
                ? 'آپ نے حفاظت ڈوجو کے تمام ۴ لیولز کامیابی کے ساتھ مکمل کر لیے ہیں۔ اب آپ اپنے خاندان اور کمیونٹی کو محفوظ رکھنے کے اہل ہیں۔'
                : 'You have mastered all four Dojo levels and proven your cybersecurity instincts. Claim your official Community Guardian certificate!'}
            </p>
            <Link to="/certificate/final" className="btn-primary text-base sm:text-lg">
              📜 {isUrdu ? 'مکمل کمیونٹی گارڈین سرٹیفکیٹ' : 'View Master Certificate'}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
