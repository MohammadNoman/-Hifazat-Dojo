import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useGame, useGameDispatch, saveTeacherRecord } from '../store/GameContext';
import { getQuestionsByLevel, LEVELS, POINTS_CORRECT, POINTS_LEARNING } from '../data/questions';
import SafetyWarning from '../components/SafetyWarning';
import ScenarioCard, { getScenarioType } from '../components/ScenarioCard';

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
    return (
      <div className="page-container flex items-center justify-center min-h-[400px]">
        <div className="card text-center p-8 border-shield-500/30">
          <div className="text-4xl mb-3 animate-spin">🛡️</div>
          <p className="text-navy-200 text-lg font-bold">Initializing Dojo Challenge...</p>
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
  const medium = getScenarioType(question);

  return (
    <div className={`page-container max-w-3xl ${isUrdu ? 'rtl' : ''}`}>
      {/* Tactical Top Bar: Belt Badge, Progress, Live Points & Streak */}
      <div className="card p-3 sm:p-4 mb-4 sm:mb-6 border-navy-700/80 bg-navy-900/90 shadow-xl">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-2xl p-1.5 rounded-lg bg-navy-800 border border-navy-700">{level.icon}</span>
            <div>
              <h2 className="text-sm sm:text-base font-black text-white leading-tight">
                {isUrdu ? level.name_ur : level.name_en}
              </h2>
              <p className="text-[11px] font-mono font-bold text-shield-400">
                {isUrdu
                  ? `چیلنج ${currentQuestionIndex + 1} از ۱۰`
                  : `Challenge ${currentQuestionIndex + 1} of 10`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {streak > 1 && (
              <div className="hidden xs:flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold animate-pulse-soft">
                <span>🔥</span>
                <span>{streak}x Streak</span>
              </div>
            )}
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-navy-400 block tracking-wider">Score</span>
              <span className="text-lg sm:text-2xl font-black text-shield-400 font-mono leading-none">
                {score} <span className="text-xs text-navy-400 font-normal">pts</span>
              </span>
            </div>
          </div>
        </div>

        {/* High-Tech Glowing Progress Bar */}
        <div className="w-full h-2 bg-navy-950 rounded-full overflow-hidden border border-navy-800">
          <div
            className="h-full bg-gradient-to-r from-shield-500 via-emerald-400 to-teal-300 rounded-full transition-all duration-300 ease-out shadow-sm shadow-shield-400/50"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Realistic Communication Simulator Window */}
      <div className="card-glow mb-6 overflow-hidden border border-navy-700/80 shadow-2xl">
        {/* Simulator Device Top Frame Bar */}
        <div className="bg-navy-950/90 border-b border-navy-800 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-[11px] font-mono font-bold text-navy-300 ml-2 uppercase tracking-wider">
              {medium === 'whatsapp' && '🟢 Mobile Chat Simulation'}
              {medium === 'call' && '📞 Voice Transmission Simulation'}
              {medium === 'email' && '✉️ Webmail Client Simulation'}
              {(medium === 'qr' || medium === 'qr_safe') && '📷 QR Code Scanner Simulation'}
              {medium === 'bank_otp' && '🏦 Demo Bank Alert Simulation'}
              {medium === 'safe_notice' && '🏫 Official Notice Simulation'}
              {medium === 'sms' && '💬 SMS Cellular Simulation'}
            </span>
          </div>

          {/* Exhibition Audio Narration & Student Voice Recording */}
          <div className="flex items-center gap-1.5 no-print">
            <button
              onClick={toggleScenarioAudio}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                isPlayingAudio
                  ? 'bg-shield-500 text-white animate-pulse'
                  : 'bg-navy-800 hover:bg-navy-700 text-navy-200 border border-navy-700'
              }`}
              title="Narrate Scenario"
            >
              <span>{isPlayingAudio ? '⏹️' : '🔊'}</span>
              <span>{isPlayingAudio ? 'Stop' : 'Listen'}</span>
            </button>

            <button
              onClick={toggleRecording}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                isRecording
                  ? 'bg-danger-600 text-white animate-pulse'
                  : 'bg-navy-800 hover:bg-navy-700 text-navy-200 border border-navy-700'
              }`}
              title="Record Student Voice (Exhibition demo)"
            >
              <span>{isRecording ? '🔴' : '🎙️'}</span>
              <span className="hidden sm:inline">{isRecording ? 'Recording...' : 'Record Voice'}</span>
            </button>
          </div>
        </div>

        {/* Realistic Mobile Message / Notification Card Component */}
        <div className="p-4 sm:p-6 bg-gradient-to-b from-navy-950/70 via-navy-900/60 to-navy-950/80">
          <ScenarioCard question={question} language={language} />

          {/* Core Decision Terminal */}
          <div className="pt-6 sm:pt-8 text-center border-t border-navy-800/80 mt-6">
            <div className="badge-pill bg-navy-950 text-shield-300 border-shield-500/40 mb-3 shadow">
              <span>⚖️</span>
              <span>{isUrdu ? 'آپ کا سکیورٹی فیصلہ' : 'Your Cyber Assessment'}</span>
            </div>

            <p className="text-white font-black text-xl sm:text-2xl mb-5">
              {question.question}
            </p>

            {/* Large, Tactile, High-Contrast Mobile-Friendly Safe / Scam Buttons */}
            <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-6 justify-center max-w-xl mx-auto px-2">
              <button
                onClick={() => handleAnswer('Safe')}
                disabled={isAnswered}
                className={`btn-safe flex-1 py-4 sm:py-5 px-6 sm:px-8 text-lg sm:text-xl font-black rounded-2xl transition-all duration-200 cursor-pointer ${
                  isAnswered
                    ? selectedAnswer === 'Safe'
                      ? question.correct_answer === 'Safe'
                        ? 'ring-4 ring-shield-300 bg-shield-600 scale-105 shadow-xl shadow-shield-500/40'
                        : 'ring-4 ring-danger-300 bg-danger-600 scale-105 shadow-xl shadow-danger-500/40'
                      : 'opacity-35 cursor-not-allowed'
                    : 'hover:scale-[1.03] active:scale-95 shadow-lg shadow-shield-500/25'
                }`}
              >
                <span className="text-2xl sm:text-3xl">🛡️ ✅</span>
                <span className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 leading-tight">
                  <span>SAFE</span>
                  <span className="text-xs sm:text-sm font-normal opacity-90 font-urdu">(محفوظ)</span>
                </span>
              </button>

              <button
                onClick={() => handleAnswer('Scam')}
                disabled={isAnswered}
                className={`btn-scam flex-1 py-4 sm:py-5 px-6 sm:px-8 text-lg sm:text-xl font-black rounded-2xl transition-all duration-200 cursor-pointer ${
                  isAnswered
                    ? selectedAnswer === 'Scam'
                      ? question.correct_answer === 'Scam'
                        ? 'ring-4 ring-shield-300 bg-shield-600 scale-105 shadow-xl shadow-shield-500/40'
                        : 'ring-4 ring-danger-300 bg-danger-600 scale-105 shadow-xl shadow-danger-500/40'
                      : 'opacity-35 cursor-not-allowed'
                    : 'hover:scale-[1.03] active:scale-95 shadow-lg shadow-danger-500/25'
                }`}
              >
                <span className="text-2xl sm:text-3xl">🚨 🚫</span>
                <span className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 leading-tight">
                  <span>SCAM</span>
                  <span className="text-xs sm:text-sm font-normal opacity-90 font-urdu">(دھوکہ)</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cyber Threat Intelligence Dossier (Post-Answer Feedback) */}
      {isAnswered && (
        <div className="animate-slide-up space-y-4 mb-8">
          {/* Outcome Banner */}
          <div
            className={`card text-center p-4 sm:p-5 border-2 shadow-2xl ${
              selectedAnswer === question.correct_answer
                ? 'border-shield-400 bg-gradient-to-r from-shield-950/90 to-navy-900/90 shadow-shield-500/10'
                : 'border-danger-400 bg-gradient-to-r from-danger-950/90 to-navy-900/90 shadow-danger-500/10'
            }`}
          >
            <p className="text-2xl sm:text-3xl font-black mb-1">
              {selectedAnswer === question.correct_answer
                ? (isUrdu ? '✅ شاباش! آپ کا فیصلہ بالکل درست تھا' : '✅ Decision Verified: Correct!')
                : (isUrdu ? '❌ ہوشیار رہیں! یہ ایک دھوکہ تھا' : '❌ Security Alert: Incorrect Decision')}
            </p>
            <p className="text-xs sm:text-sm text-navy-200">
              {selectedAnswer === question.correct_answer
                ? (isUrdu
                    ? `+${POINTS_CORRECT} پوائنٹس حاصل ہوئے۔ آپ نے ڈیجیٹل خطرہ درست شناخت کیا۔`
                    : `+${POINTS_CORRECT} Points Awarded. You successfully analyzed the digital indicators!`)
                : (isUrdu
                    ? `+${POINTS_LEARNING} سیکھنے کے پوائنٹس۔ نیچے دیا گیا حفاظتی تجزیہ غور سے پڑھیں۔`
                    : `+${POINTS_LEARNING} Learning Points. Study the Threat Intelligence below.`)}
            </p>
          </div>

          {/* Hint Card */}
          <div className="card border-navy-700 bg-navy-900/80">
            <h4 className="text-shield-400 font-bold mb-1.5 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2">
              <span>💡</span>
              <span>{isUrdu ? 'حفاظتی اشارہ (Security Clue)' : 'Security Clue (Hint)'}</span>
            </h4>
            <p className="text-white text-sm sm:text-base font-urdu leading-relaxed" dir="rtl">
              {question.hint_ur}
            </p>
          </div>

          {/* Urdu Detailed Explanation */}
          <div className="card border-navy-700 bg-navy-900/80">
            <h4 className="text-shield-400 font-bold mb-1.5 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2">
              <span>🇵🇰</span>
              <span>{isUrdu ? 'تفصیلی اردو رہنمائی' : 'Urdu Detailed Guidance'}</span>
            </h4>
            <p className="text-white text-sm sm:text-base font-urdu leading-relaxed" dir="rtl">
              {question.explanation_ur}
            </p>
          </div>

          {/* English Threat Intelligence Analysis */}
          <div className="card border-navy-700 bg-navy-900/80 text-left">
            <h4 className="text-shield-400 font-bold mb-1.5 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2">
              <span>🇬🇧</span>
              <span>Threat Intelligence (English Analysis)</span>
            </h4>
            <p className="text-navy-100 text-sm sm:text-base leading-relaxed">
              {question.explanation_en}
            </p>
          </div>

          {/* Community Defense Protocol */}
          <div className="card bg-gradient-to-r from-shield-950/60 to-navy-900/90 border-shield-500/50 text-left">
            <h4 className="text-shield-300 font-bold mb-1.5 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2">
              <span>🛡️</span>
              <span>{isUrdu ? 'کمیونٹی حفاظتی اقدام (Defense Action)' : 'Community Defense Protocol'}</span>
            </h4>
            <p className="text-white text-sm sm:text-base leading-relaxed">
              {question.correct_answer === 'Scam'
                ? (isUrdu
                    ? 'فوری طور پر میسج کا جواب نہ دیں، کال کاٹ دیں، رابطے کو بلاک کریں، اور کسی قابلِ اعتماد بڑے یا اسکول کو مطلع کریں۔'
                    : 'Do not click links or reply. Preserve a screenshot, block the contact immediately, and notify a trusted parent, teacher, or authority.')
                : (isUrdu
                    ? 'یہ ایک جائز سرگرمی ہے۔ باقاعدہ حفاظت کے اصول یاد رکھیں اور اپنی شناختی معلومات کسی سے شیئر نہ کریں۔'
                    : 'This represents legitimate routine activity. Maintain healthy cyber hygiene and never disclose private passwords.')}
            </p>
          </div>

          {/* Advance Button */}
          <div className="text-center pt-3">
            <button onClick={handleNext} className="btn-primary w-full sm:w-auto text-base sm:text-lg py-3.5 px-10 shadow-xl">
              {currentQuestionIndex < 9
                ? (isUrdu ? 'اگلا چیلنج دیکھیں ➡️' : 'Next Scenario ➡️')
                : (isUrdu ? '📊 لیول کا نتیجہ اور بیج حاصل کریں' : '📊 View Level Debrief & Badge')}
            </button>
          </div>
        </div>
      )}

      {/* Safety Notice */}
      <div className="mt-8">
        <SafetyWarning />
      </div>
    </div>
  );
}

// Subcomponent: Exhibition-Grade Level Result Screen
function LevelResult({ levelNum, state, dispatch, navigate, isUrdu, level, questions }) {
  const { score, correctAnswers, maxStreak, answers, levelScores } = state;
  const passed = correctAnswers >= 7;

  const wrongAnswers = answers.filter((a) => !a.isCorrect);
  const wrongCategories = wrongAnswers.map((a) => {
    const q = questions[a.questionIndex];
    return q ? q.title_en : 'General Cybersecurity';
  });

  // Record results in protected teacher storage
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
      en: 'Never share SMS OTPs, temporary verification codes, or bank PINs.',
      ur: 'کبھی بھی اپنا SMS او ٹی پی، تصدیقی کوڈ یا بینک پن کسی کو نہ بتائیں۔',
    },
    {
      en: 'Always verify unexpected emergencies using a known saved family contact.',
      ur: 'کسی بھی ہنگامی رقم کے مطالبے کی تصدیق پہلے سے محفوظ خاندانی نمبر سے کریں۔',
    },
    {
      en: 'Preserve evidence of digital extortion and report through verified national channels.',
      ur: 'دھوکے کے پیغامات کا اسکرین شاٹ رکھیں اور سرکاری ہیلپ لائن (1991) پر رپورٹ کریں۔',
    },
  ];

  // Radial score progress geometry
  const accuracyPercent = Math.round((correctAnswers / 10) * 100);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (accuracyPercent / 100) * circumference;

  return (
    <div className={`page-container max-w-2xl text-center ${isUrdu ? 'rtl' : ''}`}>
      <div className="animate-slide-up">
        {/* Celebration Aura */}
        <div className={`text-6xl sm:text-7xl mb-3 ${passed ? 'animate-float' : ''}`}>
          {passed ? '🎉' : '🛡️'}
        </div>

        <div className="badge-pill bg-navy-900 text-shield-300 border-shield-500/40 mb-3 shadow">
          <span>{passed ? 'Dojo Level Mastery Cleared' : 'Assessment Completed'}</span>
        </div>

        <h1 className={`text-3xl sm:text-5xl font-black mb-2 tracking-tight ${passed ? 'text-gradient' : 'text-danger-400'}`}>
          {passed
            ? (isUrdu ? 'مبارک ہو! لیول فتح ہو گیا' : 'Level Cleared!')
            : (isUrdu ? 'دوبارہ مشق کریں' : 'Needs Practice (Try Again)')}
        </h1>

        <p className="text-navy-300 text-sm sm:text-base mb-8">
          {level.icon} {isUrdu ? level.name_ur : level.name_en} •{' '}
          {passed
            ? (isUrdu ? 'اگلا ڈوجو بیلٹ ان لاک ہو گیا ہے!' : 'Next Belt Tier Unlocked!')
            : (isUrdu ? 'اگلا لیول کھولنے کے لیے کم از کم ۷ درست جوابات درکار ہیں۔' : 'Score at least 7/10 (70%) to unlock the next level.')}
        </p>

        {/* Circular SVG Gauge & Performance Dashboard */}
        <div className="card-glow mb-8 p-6">
          <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
            {/* SVG Circular Radial Progress */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  stroke="#102142"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  stroke={passed ? '#24c37f' : '#ef4444'}
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white font-mono">{accuracyPercent}%</span>
                <span className="text-[10px] uppercase font-bold text-navy-400">Accuracy</span>
              </div>
            </div>

            {/* Metric Tiles */}
            <div className="grid grid-cols-2 gap-3 flex-1 w-full text-center">
              <div className="p-3 bg-navy-950/80 rounded-xl border border-navy-800">
                <p className="text-2xl sm:text-3xl font-black text-shield-400 font-mono">{score}</p>
                <p className="text-navy-400 text-xs font-semibold">{isUrdu ? 'سکور / ۱۰۰' : 'Score / 100'}</p>
              </div>

              <div className="p-3 bg-navy-950/80 rounded-xl border border-navy-800">
                <p className="text-2xl sm:text-3xl font-black text-white font-mono">{correctAnswers}/10</p>
                <p className="text-navy-400 text-xs font-semibold">{isUrdu ? 'درست جوابات' : 'Correct (7+ pass)'}</p>
              </div>

              <div className="p-3 bg-navy-950/80 rounded-xl border border-navy-800">
                <p className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">{maxStreak}</p>
                <p className="text-navy-400 text-xs font-semibold">{isUrdu ? 'بہترین سلسلہ' : 'Best Streak'}</p>
              </div>

              <div className="p-3 bg-navy-950/80 rounded-xl border border-navy-800">
                <p className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                  {passed ? 'PASSED' : 'RETRY'}
                </p>
                <p className="text-navy-400 text-xs font-semibold">{isUrdu ? 'حالت' : 'Status'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Shiny 3D Badge Showcase Card */}
        {passed && (
          <div className="card mb-8 bg-gradient-to-r from-shield-950/90 via-navy-900 to-navy-950 border-shield-400/50 shadow-xl shadow-shield-500/10">
            <div className="flex items-center justify-center gap-4">
              <span className="text-5xl animate-float">🏅</span>
              <div className="text-left">
                <p className="text-shield-400 font-bold text-xs uppercase tracking-wider">Official Badge Earned</p>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  {isUrdu ? level.badge_ur : level.badge_en}
                </h3>
                <p className="text-navy-300 text-xs mt-0.5">Verified on School STREAM Exhibition Record</p>
              </div>
            </div>
          </div>
        )}

        {/* 3 Golden Habits */}
        <div className="card mb-8 text-left border-navy-700">
          <h3 className="text-shield-400 font-bold mb-3 text-sm sm:text-base flex items-center gap-2">
            <span>🛡️</span>
            <span>{isUrdu ? 'سیکھی گئی ۳ اہم حفاظتی عادات' : '3 Essential Cyber Defense Habits Learned'}</span>
          </h3>
          <ul className="space-y-2.5 text-xs sm:text-sm text-navy-100">
            {safetyHabits.map((habit, idx) => (
              <li key={idx} className="flex items-start gap-2.5 bg-navy-950/60 p-2.5 rounded-xl border border-navy-800">
                <span className="text-shield-400 font-black mt-0.5 text-sm">✓</span>
                <span className={isUrdu ? 'font-urdu leading-relaxed' : ''}>
                  {isUrdu ? habit.ur : habit.en}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Review Missed Scenarios */}
        {wrongAnswers.length > 0 && (
          <div className="card mb-8 text-left border-danger-500/40">
            <h3 className="text-danger-400 font-bold mb-3 text-sm sm:text-base flex items-center gap-2">
              <span>📝</span>
              <span>{isUrdu ? 'توجہ طلب چیلنجز کا جائزہ' : 'Scenarios to Review (Classroom Focus)'}</span>
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-navy-200">
              {wrongAnswers.map((wa) => {
                const q = questions[wa.questionIndex];
                return q ? (
                  <li key={wa.questionIndex} className="p-3 bg-navy-950/80 rounded-xl border border-navy-800">
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
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <button
            onClick={() => dispatch({ type: 'RESET_LEVEL' })}
            className="btn-secondary text-sm sm:text-base"
          >
            🔄 {isUrdu ? 'دوبارہ مشق کریں' : 'Try Again'}
          </button>

          {passed && (
            <>
              <button
                onClick={() => navigate(`/certificate/${levelNum}`)}
                className="btn-primary text-sm sm:text-base"
              >
                📜 {isUrdu ? 'سرٹیفکیٹ حاصل کریں' : 'Claim Certificate'}
              </button>

              {levelNum < 4 && (
                <button
                  onClick={() => {
                    dispatch({ type: 'START_LEVEL', payload: levelNum + 1 });
                    navigate(`/quiz/${levelNum + 1}`);
                  }}
                  className="btn-primary bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-sm sm:text-base border-blue-400/40"
                >
                  ➡️ {isUrdu ? 'اگلا ڈوجو بیلٹ' : 'Next Dojo Stage'}
                </button>
              )}
            </>
          )}

          <button onClick={() => navigate('/levels')} className="btn-secondary text-sm sm:text-base">
            🏯 {isUrdu ? 'تمام لیولز' : 'All Levels'}
          </button>
        </div>
      </div>
    </div>
  );
}
