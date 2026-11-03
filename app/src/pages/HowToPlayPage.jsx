import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '../store/GameContext';
import SafetyWarning from '../components/SafetyWarning';

export default function HowToPlayPage() {
  const { language } = useGame();
  const isUrdu = language === 'ur';

  // Interactive Mini Practice Sandbox
  const [practiceAnswer, setPracticeAnswer] = useState(null);

  const steps = [
    {
      num: '01',
      icon: '🔍',
      title_en: 'Inspect the Scenario',
      title_ur: 'منظرنامے کا بغور تجزیہ کریں',
      desc_en:
        'Read the realistic simulation carefully. Look out for red flags: unusual urgency, fake prizes, spelling mistakes, or anyone asking for private passwords and OTPs.',
      desc_ur:
        'فرضی ایس ایم ایس، کال، واٹس ایپ میسج یا ای میل کو غور سے پڑھیں۔ خطرے کی علامات جیسے کہ جلدی مچانا، نامعلوم لنکس یا پاس ورڈ اور او ٹی پی مانگنے پر نظر رکھیں۔',
      pill_en: 'Look for Red Flags',
      pill_ur: 'خطرے کے اشارے',
    },
    {
      num: '02',
      icon: '⚖️',
      title_en: 'Decide: Safe or Scam?',
      title_ur: 'فیصلہ کریں: محفوظ یا سکیم؟',
      desc_en:
        'Click either "Safe" or "Scam". Every scenario is an authentic educational simulation designed to test real-world reflexes.',
      desc_ur:
        'بغیر کسی دباؤ کے صرف دو بٹنوں میں سے ایک منتخب کریں: "Safe" (محفوظ) یا "Scam" (دھوکہ)۔',
      pill_en: 'Single-Tap Choice',
      pill_ur: 'آسان فیصلہ',
    },
    {
      num: '03',
      icon: '💡',
      title_en: 'Learn from Dojo Intelligence',
      title_ur: 'حفاظتی حکمت اور فیڈ بیک سے سیکھیں',
      desc_en:
        'Instant feedback explains WHY the scenario is safe or deceptive. You get clues in Urdu, English analysis, and actionable community defense steps.',
      desc_ur:
        'ہر فیصلے کے فوراً بعد اردو اور انگریزی میں مکمل سکیورٹی تجزیہ، اشارہ اور عملی قدم سامنے آئے گا تاکہ آپ کی معلومات میں اضافہ ہو۔',
      pill_en: 'Bilingual Explanations',
      pill_ur: 'اردو اور انگریزی رہنمائی',
    },
    {
      num: '04',
      icon: '🏆',
      title_en: 'Score 70% & Earn Badges',
      title_ur: '۷۰٪ سکور کر کے بیج اور سرٹیفکیٹ لیں',
      desc_en:
        'Score at least 7 out of 10 to unlock the next Dojo Belt. Complete all 4 levels to unlock the Community Guardian honors diploma!',
      desc_ur:
        'اگلا لیول کھولنے کے لیے ۱۰ میں سے ۷ درست جوابات ضروری ہیں۔ تمام ۴ لیولز مکمل کر کے کمیونٹی گارڈین سرٹیفکیٹ حاصل کریں۔',
      pill_en: 'Mastery & Honors',
      pill_ur: 'قومی سرٹیفکیٹ',
    },
  ];

  return (
    <div className={`page-container ${isUrdu ? 'rtl' : ''}`}>
      {/* Page Header */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="badge-pill bg-navy-900 text-shield-300 border-shield-500/40 mb-3 shadow">
          <span>🎯</span>
          <span>Simple 4-Step Rules</span>
          <span className="text-navy-500">•</span>
          <span>Exhibition Training Guide</span>
        </div>

        <h1 className="section-title text-3xl sm:text-5xl font-black">
          {isUrdu ? '📖 کیسے کھیلیں اور اصول' : '📖 How to Play Hifazat Dojo'}
        </h1>

        <p className="text-navy-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          {isUrdu
            ? 'حفاظت ڈوجو ایک تعلیمی سائبر سکیورٹی گیم ہے۔ صرف ۴ آسان مراحل میں ڈیجیٹل دھوکے بازوں کو پہچاننا اور اپنی حفاظت کرنا سیکھیں۔'
            : 'Hifazat Dojo is a hands-on cybersecurity simulator. Follow these 4 simple steps to sharpen your digital self-defense instincts.'}
        </p>
      </div>

      {/* Safety Warning */}
      <div className="max-w-3xl mx-auto mb-10">
        <SafetyWarning />
      </div>

      {/* 4 Simple Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-4xl mx-auto mb-12">
        {steps.map((step) => (
          <div
            key={step.num}
            className="card relative overflow-hidden group hover:border-shield-400/60 hover:bg-navy-900/90 transition-all duration-300 p-6 flex flex-col justify-between"
          >
            {/* Big Step Number in Background */}
            <div className="absolute top-3 right-4 font-mono font-black text-4xl sm:text-5xl text-navy-800/60 group-hover:text-shield-500/20 transition-colors pointer-events-none">
              {step.num}
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl p-2.5 rounded-xl bg-navy-950 border border-navy-800 shadow">
                  {step.icon}
                </span>
                <div>
                  <span className="badge-pill bg-navy-950/80 text-shield-400 border-shield-500/30 text-[10px] py-0.5 px-2 mb-1">
                    {isUrdu ? step.pill_ur : step.pill_en}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    {isUrdu ? step.title_ur : step.title_en}
                  </h3>
                </div>
              </div>

              <p className={`text-navy-200 text-xs sm:text-sm leading-relaxed mb-4 ${isUrdu ? 'font-urdu' : ''}`}>
                {isUrdu ? step.desc_ur : step.desc_en}
              </p>
            </div>

            <div className="pt-2 border-t border-navy-800/80 flex items-center justify-between text-xs text-navy-400 font-mono">
              <span>Step {step.num} of 04</span>
              <span className="text-shield-400 font-bold">Rule Verified ✓</span>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Practice Sandbox */}
      <div className="card-glow max-w-2xl mx-auto p-6 sm:p-8 mb-12 border-shield-500/50 bg-gradient-to-b from-navy-900 to-navy-950">
        <div className="text-center mb-4">
          <div className="badge-pill bg-shield-950 text-shield-300 border-shield-400/40 mb-2">
            <span>⚡ Interactive Practice Sandbox</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {isUrdu ? 'آئیے ایک فرضی مشق کر کے دیکھیں!' : 'Try a Quick Practice Scenario!'}
          </h2>
          <p className="text-navy-300 text-xs sm:text-sm">
            {isUrdu
              ? 'نیچے دیے گئے فرضی پیغام کو دیکھیں اور فیصلہ کریں:'
              : 'Test your reflexes right now with no risk:'}
          </p>
        </div>

        {/* Fictional Sandbox Scenario Card */}
        <div className="bg-navy-950 p-4 rounded-xl border border-navy-800 mb-4 text-left">
          <p className="text-xs text-navy-400 uppercase font-mono font-bold mb-1">Incoming SMS Simulation:</p>
          <p className="text-white text-sm sm:text-base font-medium">
            "Mubarak ho! Aap ne 50,000 ka cash prize jeeta hai. Prize receive karne ke liye abhi apna ATM PIN reply karein."
          </p>
        </div>

        {/* Decision Buttons */}
        <div className="flex gap-4 justify-center mb-4">
          <button
            onClick={() => setPracticeAnswer('Safe')}
            className={`btn-safe text-sm sm:text-base py-2.5 px-6 ${
              practiceAnswer === 'Safe' ? 'ring-4 ring-danger-400 bg-danger-600' : ''
            }`}
          >
            ✅ Safe
          </button>
          <button
            onClick={() => setPracticeAnswer('Scam')}
            className={`btn-scam text-sm sm:text-base py-2.5 px-6 ${
              practiceAnswer === 'Scam' ? 'ring-4 ring-shield-300 bg-shield-600' : ''
            }`}
          >
            🚫 Scam
          </button>
        </div>

        {/* Sandbox Feedback */}
        {practiceAnswer && (
          <div
            className={`p-3.5 rounded-xl text-xs sm:text-sm animate-fade-in text-center ${
              practiceAnswer === 'Scam'
                ? 'bg-shield-950/80 border border-shield-500 text-shield-200'
                : 'bg-danger-950/80 border border-danger-500 text-danger-200'
            }`}
          >
            {practiceAnswer === 'Scam' ? (
              <p>
                <strong>✅ بالکل درست!</strong> کوئی بھی اصلی انعام دینے والا آپ کا اے ٹی ایم پن (PIN) نہیں مانگتا۔ پن ہمیشہ خفیہ رکھنا چاہیے!
              </p>
            ) : (
              <p>
                <strong>❌ خبردار!</strong> یہ ایک فراڈ ہے۔ اے ٹی ایم پن کسی کو میسج میں دینے سے آپ کا اکاؤنٹ خالی ہو سکتا ہے۔
              </p>
            )}
          </div>
        )}
      </div>

      {/* Scoring Rules Guide */}
      <div className="card max-w-4xl mx-auto p-6 sm:p-8 mb-12">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>📊</span>
          <span>{isUrdu ? 'پوائنٹس اور پاسنگ کا طریقہ کار' : 'Scoring System & Unlocking Logic'}</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div className="p-4 bg-navy-950/80 rounded-xl border border-navy-800 text-center">
            <span className="text-3xl block mb-1">🎯</span>
            <p className="font-bold text-shield-400 text-base mb-1">+10 Points</p>
            <p className="text-navy-300">Awarded for every first-time correct Safe/Scam decision.</p>
          </div>
          <div className="p-4 bg-navy-950/80 rounded-xl border border-navy-800 text-center">
            <span className="text-3xl block mb-1">💡</span>
            <p className="font-bold text-amber-400 text-base mb-1">+3 Learning Points</p>
            <p className="text-navy-300">Awarded when studying an incorrect choice so students never stop learning.</p>
          </div>
          <div className="p-4 bg-navy-950/80 rounded-xl border border-navy-800 text-center">
            <span className="text-3xl block mb-1">🔓</span>
            <p className="font-bold text-emerald-400 text-base mb-1">7/10 (70%) Pass</p>
            <p className="text-navy-300">Required accuracy to unlock the next Dojo Belt and claim a certificate.</p>
          </div>
        </div>
      </div>

      {/* Ready to Enter Dojo Call to Action */}
      <div className="text-center flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/levels" className="btn-primary text-base sm:text-lg py-3 px-8">
          <span>🥋</span>
          <span>{isUrdu ? 'چیلنج کے لیے تیار ہیں! لیول منتخب کریں' : 'Ready to Play! Select Dojo Level'}</span>
        </Link>
        <Link to="/" className="btn-secondary text-base">
          {isUrdu ? 'ہوم پیج پر واپس جائیں' : 'Return to Home'}
        </Link>
      </div>
    </div>
  );
}
