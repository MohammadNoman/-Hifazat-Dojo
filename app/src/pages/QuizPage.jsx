import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useGame, useGameDispatch, saveTeacherRecord } from '../store/GameContext';
import { getQuestionsByLevel, LEVELS, POINTS_CORRECT, POINTS_LEARNING } from '../data/questions';
import SafetyWarning from '../components/SafetyWarning';

export default function QuizPage() {
  const { levelId } = useParams();
  const levelNum = parseInt(levelId, 10);
  const navigate = useNavigate();
  const state = useGame();
  const dispatch = useGameDispatch();

  const {
    language,
    currentLevel,
    currentQuestionIndex,
    score,
    correctAnswers,
    streak,
    isAnswered,
    selectedAnswer,
    showResult,
  } = state;

  const isUrdu = language === 'ur';
  const questions = getQuestionsByLevel(levelNum);
  const level = LEVELS.find((l) => l.id === levelNum);

  // Audio recording & playback state for student STREAM exhibition feature
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Initialize level in state via useEffect to avoid render-phase side effects
  useEffect(() => {
    if (level && currentLevel !== levelNum) {
      dispatch({ type: 'START_LEVEL', payload: levelNum });
    }
  }, [level, currentLevel, levelNum, dispatch]);

  // Clean audio state on question change
  useEffect(() => {
    setIsPlayingAudio(false);
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, [currentQuestionIndex]);

  if (!language) {
    return <Navigate to="/language" replace />;
  }
  if (!level || questions.length === 0) {
    return <Navigate to="/levels" replace />;
  }
  if (currentLevel !== levelNum) {
    // Render graceful loading shell while state syncs
    return (
      <div className="page-container flex items-center justify-center">
        <div className="card text-center p-8">
          <p className="text-navy-300 text-lg">⏳ Loading Dojo Level...</p>
        </div>
      </div>
    );
  }

  // Result screen subcomponent
  if (showResult) {
    return (
      <LevelResult
        levelNum={levelNum}
        state={state}
        dispatch={dispatch}
        navigate={navigate}
        isUrdu={isUrdu}
        level={level}
        questions={questions}
      />
    );
  }

  const question = questions[currentQuestionIndex];
  if (!question) return null;

  function handleAnswer(answer) {
    if (isAnswered) return;
    const isCorrect = answer === question.correct_answer;
    dispatch({
      type: 'ANSWER_QUESTION',
      payload: {
        answer,
        isCorrect,
        points: isCorrect ? POINTS_CORRECT : POINTS_LEARNING,
      },
    });
  }

  function handleNext() {
    dispatch({ type: 'NEXT_QUESTION' });
  }

  // Student Audio Playback / Narration handler
  function toggleScenarioAudio() {
    if (recordedAudioUrl) {
      const audio = new Audio(recordedAudioUrl);
      setIsPlayingAudio(true);
      audio.onended = () => setIsPlayingAudio(false);
      audio.play();
      return;
    }

    if (!window.speechSynthesis) {
      alert(isUrdu ? 'براؤزر آڈیو کو سپورٹ نہیں کرتا' : 'Speech synthesis not supported on this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const textToRead = question.scenario;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.9;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  }

  // Student Recording feature (Record voice for exhibition presentation)
  async function toggleRecording() {
    if (isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(blob);
          setRecordedAudioUrl(url);
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.warn('Microphone access denied or unavailable', err);
        alert(isUrdu ? 'مائیکروفون کی اجازت نہیں ملی۔' : 'Microphone permission not granted.');
      }
    }
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Detect scenario communication medium for realistic simulator framing
  const scenarioText = question.scenario.toLowerCase();
  let mediumType = 'sms';
  let mediumBadge = { icon: '💬', label: 'SMS Message', border: 'border-blue-500/40' };

  if (scenarioText.includes('call') || scenarioText.includes('caller')) {
    mediumType = 'call';
    mediumBadge = { icon: '📞', label: 'Incoming Call', border: 'border-amber-500/40' };
  } else if (scenarioText.includes('whatsapp')) {
    mediumType = 'whatsapp';
    mediumBadge = { icon: '🟢', label: 'WhatsApp Chat', border: 'border-emerald-500/40' };
  } else if (scenarioText.includes('email')) {
    mediumType = 'email';
    mediumBadge = { icon: '✉️', label: 'Email Inbox', border: 'border-purple-500/40' };
  } else if (scenarioText.includes('qr') || scenarioText.includes('scan')) {
    mediumType = 'qr';
    mediumBadge = { icon: '📷', label: 'QR Scan / Stall', border: 'border-cyan-500/40' };
  }

  return (
    <div className={`page-container max-w-3xl ${isUrdu ? 'rtl' : ''}`}>
      {/* Top Bar: Level Name, Question Count & Live Score */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-navy-200 flex items-center gap-1.5">
            <span>{level.icon}</span>
            <span>{isUrdu ? level.name_ur : level.name_en}</span>
          </h2>
          <p className="text-navy-400 text-xs sm:text-sm">
            {isUrdu
              ? `سوال ${currentQuestionIndex + 1} از ۱۰`
              : `Question ${currentQuestionIndex + 1} of 10`}
          </p>
        </div>

        <div className="text-right">
          <p className="text-shield-400 font-black text-lg sm:text-xl">
            {isUrdu ? `سکور: ${score}` : `Score: ${score}`}
          </p>
          {streak > 1 && (
            <p className="text-amber-400 text-xs sm:text-sm font-bold animate-pulse-soft">
              🔥 {isUrdu ? `سلسلہ: ${streak}` : `Streak: ${streak}`}
            </p>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-navy-800 rounded-full mb-6 overflow-hidden border border-navy-700/60">
        <div
          className="h-full bg-gradient-to-r from-shield-500 to-shield-300 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Scenario Card Simulation */}
      <div className={`card-glow mb-6 animate-fade-in border-2 ${mediumBadge.border}`}>
        {/* Medium Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-navy-700/60 text-xs text-navy-300">
          <div className="flex items-center gap-2">
            <span className="text-base">{mediumBadge.icon}</span>
            <span className="font-semibold uppercase tracking-wider">{mediumBadge.label}</span>
          </div>

          {/* Student Audio Narration & Recording Controls */}
          <div className="flex items-center gap-1.5 no-print">
            <button
              onClick={toggleScenarioAudio}
              className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
                isPlayingAudio
                  ? 'bg-shield-500 text-white animate-pulse'
                  : 'bg-navy-700 hover:bg-navy-600 text-navy-200'
              }`}
              title="Student Narration Playback"
            >
              <span>{isPlayingAudio ? '⏹️' : '🔊'}</span>
              <span>{isPlayingAudio ? 'Stop' : 'Listen'}</span>
            </button>

            <button
              onClick={toggleRecording}
              className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
                isRecording
                  ? 'bg-danger-600 text-white animate-pulse'
                  : 'bg-navy-700 hover:bg-navy-600 text-navy-200'
              }`}
              title="Record Student Voice (Exhibition demo)"
            >
              <span>{isRecording ? '🔴' : '🎙️'}</span>
              <span>{isRecording ? 'Recording...' : 'Record Voice'}</span>
            </button>
          </div>
        </div>

        {/* Scenario Body */}
        <div className="mb-4">
          <h3 className="text-xs sm:text-sm font-semibold text-shield-400 mb-2">
            {isUrdu ? question.title_ur : question.title_en}
          </h3>
          <p className="text-white text-base sm:text-lg leading-relaxed font-medium bg-navy-900/60 p-4 rounded-xl border border-navy-700/50">
            {question.scenario}
          </p>
        </div>

        {/* Big Safe / Scam Interaction Prompt */}
        <div className="pt-2">
          <p className="text-shield-300 font-bold text-center text-lg sm:text-xl mb-4">
            {question.question}
          </p>

          <div className="flex gap-3 sm:gap-6 justify-center">
            <button
              onClick={() => handleAnswer('Safe')}
              disabled={isAnswered}
              className={`btn-safe flex-1 max-w-[200px] ${
                isAnswered
                  ? selectedAnswer === 'Safe'
                    ? question.correct_answer === 'Safe'
                      ? 'ring-4 ring-shield-300 bg-shield-600'
                      : 'ring-4 ring-danger-300 bg-danger-600'
                    : 'opacity-40 cursor-not-allowed'
                  : ''
              }`}
            >
              <span>✅</span>
              <span>Safe</span>
            </button>

            <button
              onClick={() => handleAnswer('Scam')}
              disabled={isAnswered}
              className={`btn-scam flex-1 max-w-[200px] ${
                isAnswered
                  ? selectedAnswer === 'Scam'
                    ? question.correct_answer === 'Scam'
                      ? 'ring-4 ring-shield-300 bg-shield-600'
                      : 'ring-4 ring-danger-300 bg-danger-600'
                    : 'opacity-40 cursor-not-allowed'
                  : ''
              }`}
            >
              <span>🚫</span>
              <span>Scam</span>
            </button>
          </div>
        </div>
      </div>

      {/* Post-Answer Educational Feedback & Guidance */}
      {isAnswered && (
        <div className="animate-slide-up space-y-4 mb-8">
          {/* Result Alert */}
          <div
            className={`card text-center p-4 border-2 ${
              selectedAnswer === question.correct_answer
                ? 'border-shield-500 bg-shield-950/60'
                : 'border-danger-500 bg-danger-950/60'
            }`}
          >
            <p className="text-2xl sm:text-3xl font-extrabold mb-1">
              {selectedAnswer === question.correct_answer
                ? (isUrdu ? '✅ شاباش! بالکل درست جواب' : '✅ Correct Decision!')
                : (isUrdu ? '❌ ہوشیار رہیں! یہ غلط تھا' : '❌ Incorrect Assessment')}
            </p>
            <p className="text-sm text-navy-200">
              {selectedAnswer === question.correct_answer
                ? (isUrdu
                    ? `+${POINTS_CORRECT} پوائنٹس حاصل ہوئے۔ آپ نے خطرہ درست پہچانا۔`
                    : `+${POINTS_CORRECT} Points Awarded. Excellent cyber instincts!`)
                : (isUrdu
                    ? `+${POINTS_LEARNING} سیکھنے کے پوائنٹس۔ نیچے دی گئی وضاحت غور سے پڑھیں۔`
                    : `+${POINTS_LEARNING} Learning Points. Read the guidance below carefully.`)}
            </p>
          </div>

          {/* Hint Card */}
          <div className="card">
            <h4 className="text-shield-400 font-bold mb-1 text-sm sm:text-base flex items-center gap-2">
              <span>💡</span>
              <span>{isUrdu ? 'رہنما اصول (Hint)' : 'Security Clue (Hint)'}</span>
            </h4>
            <p className="text-navy-100 text-sm sm:text-base font-urdu" dir="rtl">
              {question.hint_ur}
            </p>
          </div>

          {/* Urdu Explanation */}
          <div className="card">
            <h4 className="text-shield-400 font-bold mb-1 text-sm sm:text-base flex items-center gap-2">
              <span>🇵🇰</span>
              <span>{isUrdu ? 'تفصیلی اردو وضاحت' : 'Urdu Explanation'}</span>
            </h4>
            <p className="text-navy-100 text-sm sm:text-base font-urdu" dir="rtl">
              {question.explanation_ur}
            </p>
          </div>

          {/* English Explanation */}
          <div className="card">
            <h4 className="text-shield-400 font-bold mb-1 text-sm sm:text-base flex items-center gap-2">
              <span>🇬🇧</span>
              <span>{isUrdu ? 'انگریزی وضاحت' : 'English Explanation'}</span>
            </h4>
            <p className="text-navy-100 text-sm sm:text-base leading-relaxed">
              {question.explanation_en}
            </p>
          </div>

          {/* Practical Next Action */}
          <div className="card bg-shield-900/30 border-shield-500/40">
            <h4 className="text-shield-300 font-bold mb-1 text-sm sm:text-base flex items-center gap-2">
              <span>🛡️</span>
              <span>{isUrdu ? 'عملی اقدام (Practical Next Action)' : 'Practical Next Action'}</span>
            </h4>
            <p className="text-white text-sm sm:text-base">
              {question.correct_answer === 'Scam'
                ? (isUrdu
                    ? 'فوری طور پر میسج کو نظر انداز کریں، کال کاٹ دیں، بھیجنے والے کو بلاک کریں، اور کسی قابلِ اعتماد بڑے یا استاد کو بتائیں۔'
                    : 'Immediately avoid replying, block the contact, take a screenshot as evidence, and report it to a trusted adult or school coordinator.')
                : (isUrdu
                    ? 'یہ ایک محفوظ اور معمول کی سرگرمی ہے۔ حفاظت کے اچھے اصول جاری رکھیں اور کبھی بھی اپنے پاس ورڈ یا او ٹی پی کسی کو نہ دیں۔'
                    : 'This is safe behavior. Maintain these good digital habits and never reveal your private passwords or OTPs.')}
            </p>
          </div>

          {/* Next / Result Button */}
          <div className="text-center pt-2">
            <button onClick={handleNext} className="btn-primary w-full sm:w-auto text-base sm:text-lg">
              {currentQuestionIndex < 9
                ? (isUrdu ? 'اگلا سوال ➡️' : 'Next Question ➡️')
                : (isUrdu ? '📊 لیول کا نتیجہ دیکھیں' : '📊 View Level Results')}
            </button>
          </div>
        </div>
      )}

      {/* Safety Warning */}
      <div className="mt-8">
        <SafetyWarning />
      </div>
    </div>
  );
}

// Subcomponent: Level Result Screen
function LevelResult({ levelNum, state, dispatch, navigate, isUrdu, level, questions }) {
  const { score, correctAnswers, maxStreak, answers, levelScores } = state;
  const passed = correctAnswers >= 7;

  // Compute mistake categories for teacher review
  const wrongAnswers = answers.filter((a) => !a.isCorrect);
  const wrongCategories = wrongAnswers.map((a) => {
    const q = questions[a.questionIndex];
    return q ? q.title_en : 'General Safety';
  });

  // Record results in protected teacher storage inside useEffect
  useEffect(() => {
    if (levelScores[levelNum]?.date) {
      const record = {
        level: levelNum,
        levelName: level.name_en,
        score,
        correct: correctAnswers,
        total: 10,
        passed,
        maxStreak,
        wrongCategories,
        date: levelScores[levelNum].date,
      };

      try {
        const existing = JSON.parse(localStorage.getItem('hifazat_dojo_teacher_data') || '[]');
        const alreadySaved = existing.some(
          (r) => r.date === record.date && r.level === record.level
        );
        if (!alreadySaved) {
          saveTeacherRecord(record);
        }
      } catch (err) {
        console.error('Failed to save teacher record', err);
      }
    }
  }, [levelNum, levelScores, level.name_en, score, correctAnswers, passed, maxStreak, wrongCategories]);

  const safetyHabits = [
    {
      en: 'Never share SMS OTPs, verification codes, or PINs with anyone.',
      ur: 'کبھی بھی اپنا SMS او ٹی پی، تصدیقی کوڈ یا پن کسی کو شیئر نہ کریں۔',
    },
    {
      en: 'Always verify unexpected emergencies using a known saved family contact.',
      ur: 'کسی بھی ہنگامی کال یا مالی مطالبے کی تصدیق پہلے سے محفوظ خاندانی نمبر سے کریں۔',
    },
    {
      en: 'Preserve evidence of scams and report through verified national hotlines.',
      ur: 'دھوکے کے پیغامات کا ثبوت محفوظ رکھیں اور مصدقہ سرکاری چینلز پر رپورٹ کریں۔',
    },
  ];

  return (
    <div className={`page-container max-w-2xl text-center ${isUrdu ? 'rtl' : ''}`}>
      <div className="animate-slide-up">
        {/* Big Icon */}
        <div className={`text-6xl sm:text-7xl mb-3 ${passed ? 'animate-pulse-soft' : ''}`}>
          {passed ? '🎉' : '💪'}
        </div>

        <h1 className={`text-3xl sm:text-4xl font-black mb-2 ${passed ? 'text-gradient' : 'text-danger-400'}`}>
          {passed
            ? (isUrdu ? 'شاباش! لیول پاس ہو گیا' : 'Level Cleared!')
            : (isUrdu ? 'دوبارہ کوشش کریں' : 'Needs Practice (Try Again)')}
        </h1>

        <p className="text-navy-300 text-sm sm:text-base mb-6">
          {level.icon} {isUrdu ? level.name_ur : level.name_en} •{' '}
          {passed
            ? (isUrdu ? 'اگلا لیول ان لاک ہو گیا ہے!' : 'Next Level Unlocked!')
            : (isUrdu ? 'اگلا لیول کھولنے کے لیے کم از کم ۷ درست جوابات درکار ہیں۔' : 'Score at least 7/10 (70%) to unlock the next level.')}
        </p>

        {/* Score Breakdown Card */}
        <div className="card-glow mb-6">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
            <div className="p-2 sm:p-3 bg-navy-900/50 rounded-xl">
              <p className="text-2xl sm:text-4xl font-black text-shield-400">{score}</p>
              <p className="text-navy-400 text-xs sm:text-sm font-semibold">{isUrdu ? 'سکور / ۱۰۰' : 'Score / 100'}</p>
            </div>
            <div className="p-2 sm:p-3 bg-navy-900/50 rounded-xl">
              <p className="text-2xl sm:text-4xl font-black text-white">{correctAnswers}/10</p>
              <p className="text-navy-400 text-xs sm:text-sm font-semibold">{isUrdu ? 'درست جوابات' : 'Correct (7+ to pass)'}</p>
            </div>
            <div className="p-2 sm:p-3 bg-navy-900/50 rounded-xl">
              <p className="text-2xl sm:text-4xl font-black text-amber-400">{maxStreak}</p>
              <p className="text-navy-400 text-xs sm:text-sm font-semibold">{isUrdu ? 'بہترین سلسلہ' : 'Best Streak'}</p>
            </div>
          </div>
        </div>

        {/* Earned Badge */}
        {passed && (
          <div className="card mb-6 bg-gradient-to-r from-shield-900/30 to-navy-800 border-shield-500/50">
            <p className="text-shield-400 font-bold text-xs sm:text-sm mb-1 uppercase tracking-wider">
              🏅 {isUrdu ? 'حاصل کردہ اعزازی بیج' : 'Official Badge Earned'}
            </p>
            <p className="text-xl sm:text-2xl font-black text-white">
              {isUrdu ? level.badge_ur : level.badge_en}
            </p>
          </div>
        )}

        {/* Habits Learned */}
        <div className="card mb-6 text-left">
          <h3 className="text-shield-400 font-bold mb-3 text-sm sm:text-base flex items-center gap-2">
            <span>🛡️</span>
            <span>{isUrdu ? 'سیکھی گئی ۳ اہم حفاظتی عادات' : '3 Essential Cyber Habits Learned'}</span>
          </h3>
          <ul className="space-y-2 text-sm text-navy-100">
            {safetyHabits.map((habit, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-shield-400 font-bold mt-0.5">✓</span>
                <span className={isUrdu ? 'font-urdu' : ''}>{isUrdu ? habit.ur : habit.en}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Review Missed Questions */}
        {wrongAnswers.length > 0 && (
          <div className="card mb-6 text-left border-danger-500/40">
            <h3 className="text-danger-400 font-bold mb-3 text-sm sm:text-base flex items-center gap-2">
              <span>📝</span>
              <span>{isUrdu ? 'جائزہ لینے والے سوالات (Needs Review)' : 'Questions to Review'}</span>
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-navy-200">
              {wrongAnswers.map((wa) => {
                const q = questions[wa.questionIndex];
                return q ? (
                  <li key={wa.questionIndex} className="p-3 bg-navy-900/60 rounded-xl border border-navy-700/60">
                    <p className="font-bold text-white mb-1">
                      {isUrdu ? q.title_ur : q.title_en} —{' '}
                      <span className="text-danger-400">Correct: {q.correct_answer}</span>
                    </p>
                    <p className="text-navy-300">{q.explanation_en}</p>
                  </li>
                ) : null;
              })}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => dispatch({ type: 'RESET_LEVEL' })}
            className="btn-secondary"
          >
            🔄 {isUrdu ? 'دوبارہ کوشش کریں' : 'Try Again'}
          </button>

          {passed && (
            <>
              <button
                onClick={() => navigate(`/certificate/${levelNum}`)}
                className="btn-primary"
              >
                📜 {isUrdu ? 'سرٹیفکیٹ حاصل کریں' : 'Get Certificate'}
              </button>

              {levelNum < 4 && (
                <button
                  onClick={() => {
                    dispatch({ type: 'START_LEVEL', payload: levelNum + 1 });
                    navigate(`/quiz/${levelNum + 1}`);
                  }}
                  className="btn-primary bg-blue-600 hover:bg-blue-500"
                >
                  ➡️ {isUrdu ? 'اگلا ڈوجو لیول' : 'Next Dojo Level'}
                </button>
              )}
            </>
          )}

          <button onClick={() => navigate('/levels')} className="btn-secondary">
            🏯 {isUrdu ? 'تمام لیولز' : 'All Levels'}
          </button>
        </div>
      </div>
    </div>
  );
}
