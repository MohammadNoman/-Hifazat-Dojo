import { Link } from 'react-router-dom';
import { useGame } from '../store/GameContext';
import SafetyWarning from '../components/SafetyWarning';

export default function ForTeachersPage() {
  const { language } = useGame();
  const isUrdu = language === 'ur';

  const teachingModes = [
    {
      icon: '💻',
      title_en: '1. Computer Lab Hands-On',
      title_ur: '۱۔ کمپیوٹر لیب میں انفرادی یا جوڑوں کی مشق',
      desc_en:
        'Have students open the app on lab PCs or tablets. They work individually or in pairs, progressing from Level 1 (Password Safety) through Level 4 (Community Guardian). At the end of class, they enter their name and print their verified certificate.',
      desc_ur:
        'طلباء کمپیوٹر یا ٹیبلٹ پر گیم کھیلیں، لیول ۱ سے ۴ تک جائیں، اور کلاس کے اختتام پر اپنے نام کے ساتھ تصدیق شدہ سرٹیفکیٹ پرنٹ کریں۔',
    },
    {
      icon: '📽️',
      title_en: '2. Whole-Class Projector Challenge',
      title_ur: '۲۔ پروجیکٹر پر اجتماعی مباحثہ اور ووٹنگ',
      desc_en:
        'Project the scenarios on a smartboard. Read the fictional scenario aloud, have students vote "Safe" or "Scam" by a show of hands, and then discuss the clues and explanations as a group before clicking.',
      desc_ur:
        'پروجیکٹر پر منظر دکھائیں، ہاتھ کھڑے کروا کر ووٹ لیں، اور درست جواب کلک کرنے سے پہلے بچوں کے ساتھ خطرے کے نکات پر بات چیت کریں۔',
    },
    {
      icon: '👥',
      title_en: '3. Team Defense Competition',
      title_ur: '۳۔ گروہی مقابلہ اور ڈوجو سٹریک',
      desc_en:
        'Divide the class into 4 teams. Challenge each team to complete a level with the highest consecutive answer streak and the fastest time without making critical security mistakes.',
      desc_ur:
        'کلاس کو ٹیموں میں تقسیم کریں اور زیادہ سے زیادہ درست تسلسل (Streak) بنانے کا چیلنج دیں۔',
    },
  ];

  const dashboardFeatures = [
    {
      icon: '🔐',
      title_en: 'Local Passphrase Protection',
      title_ur: 'محفوظ پاس فریز تحفظ',
      desc_en:
        'Dashboard access is locked with a master passphrase (default: hifazat123). Teachers can change this passphrase at any time. No server accounts or student passwords needed.',
      desc_ur:
        'ڈیش بورڈ کو کھولنے کے لیے بنیادی پاس فریز hifazat123 ہے۔ اساتذہ اپنی مرضی سے نیا پاس فریز بھی رکھ سکتے ہیں۔',
    },
    {
      icon: '📈',
      title_en: 'Anonymous Class Analytics',
      title_ur: 'گمنام کلاس تجزیات اور چارٹس',
      desc_en:
        'Inspect total student attempts, class average score, passing rate, and participation progress across all 4 Dojo stages.',
      desc_ur:
        'کل سیشنز، اوسط سکور، پاسنگ شرح اور تمام ۴ لیولز میں شمولیت کا گراف دیکھیں۔',
    },
    {
      icon: '⚠️',
      title_en: 'Common Misconceptions Radar',
      title_ur: 'عام غلطیوں کا تجزیہ',
      desc_en:
        'The dashboard automatically flags which specific scam types (e.g. OTP requests or fake school links) students missed most often, giving you exact topics for your next lecture.',
      desc_ur:
        'طلباء جن سوالات میں بار بار غلطی کرتے ہیں ان کی فہرست دیکھیں تاکہ اگلی کلاس میں ان موضوعات پر مزید روشنی ڈالی جا سکے۔',
    },
    {
      icon: '📥',
      title_en: '1-Click CSV Evidence Export',
      title_ur: 'STREAM پروجیکٹ کے لیے CSV ثبوت',
      desc_en:
        'Download full anonymous class trial logs formatted with UTF-8 encoding for Excel. Perfect for attaching to STREAM exhibition binders or school project rubrics.',
      desc_ur:
        'ایک کلک میں تمام کارکردگی کا ڈیٹا ایکسل میں ڈاؤن لوڈ کریں تاکہ STREAM پروجیکٹ میں ثبوت کے طور پر لگایا جا سکے۔',
    },
  ];

  return (
    <div className={`page-container ${isUrdu ? 'rtl' : ''}`}>
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="badge-pill bg-navy-900 text-shield-300 border-shield-500/40 mb-3 shadow">
          <span>👨‍🏫</span>
          <span>Educator & STREAM Mentor Guide</span>
          <span className="text-navy-500">•</span>
          <span>Classroom Implementation</span>
        </div>

        <h1 className="section-title text-3xl sm:text-5xl font-black">
          {isUrdu ? 'اساتذہ کے لیے رہنما گائیڈ اور ڈیش بورڈ' : 'For Teachers: Classroom Guide & Dashboard'}
        </h1>

        <p className="text-navy-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          {isUrdu
            ? 'اسکول میں حفاظت ڈوجو چلانے کا مکمل طریقہ، کلاس روم سرگرمیاں، اور محفوظ ڈیش بورڈ سے شواہد ڈاؤن لوڈ کرنے کی تفصیلات۔'
            : 'Comprehensive instructions for teachers and STEM mentors on conducting interactive classroom sessions and leveraging dashboard analytics for project evidence.'}
        </p>

        {/* Direct CTA to Teacher Dashboard */}
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Link to="/teacher" className="btn-primary text-sm sm:text-base py-3 px-6 shadow-xl">
            <span>📊</span>
            <span>{isUrdu ? 'اساتذہ ڈیش بورڈ کھولیں (پاس فریز: hifazat123)' : 'Open Protected Dashboard (hifazat123)'}</span>
          </Link>
          <Link to="/how-to-play" className="btn-secondary text-sm sm:text-base py-3 px-6">
            <span>📖</span>
            <span>{isUrdu ? 'کیسے کھیلیں گائیڈ' : 'View How to Play'}</span>
          </Link>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="max-w-3xl mx-auto mb-10">
        <SafetyWarning />
      </div>

      {/* Section 1: Running in Class */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🏫</span>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {isUrdu ? 'کلاس میں ایپ کو کیسے استعمال کریں؟' : 'How to Run Hifazat Dojo in Your Classroom'}
            </h2>
            <p className="text-navy-300 text-xs sm:text-sm">
              {isUrdu
                ? 'مختلف تدریسی طریقوں کے ذریعے طلباء میں آگاہی پیدا کریں:'
                : 'Choose an engaging teaching model that matches your school setup:'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {teachingModes.map((mode, i) => (
            <div key={i} className="card hover:border-shield-400/50 transition-all p-5 flex flex-col justify-between">
              <div>
                <span className="text-3xl block mb-3">{mode.icon}</span>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                  {isUrdu ? mode.title_ur : mode.title_en}
                </h3>
                <p className={`text-navy-200 text-xs sm:text-sm leading-relaxed mb-4 ${isUrdu ? 'font-urdu' : ''}`}>
                  {isUrdu ? mode.desc_ur : mode.desc_en}
                </p>
              </div>
              <div className="pt-3 border-t border-navy-800 text-[11px] font-mono text-shield-400 font-bold">
                ✓ Ready for School Deployment
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Using the Protected Dashboard */}
      <div className="card-glow p-6 sm:p-8 mb-12 border-shield-500/40 bg-gradient-to-b from-navy-900 to-navy-950">
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📊</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {isUrdu ? 'اساتذہ ڈیش بورڈ کیسے استعمال کریں؟' : 'How to Use the Teacher Dashboard'}
              </h2>
              <p className="text-navy-300 text-xs sm:text-sm">
                {isUrdu ? 'پاس فریز محفوظ، مکمل گمنام اور آف لائن ڈیٹا اینالیٹکس' : 'Passphrase-protected, 100% anonymous, and offline data collection.'}
              </p>
            </div>
          </div>
          <Link to="/teacher" className="btn-primary text-xs sm:text-sm py-2 px-4">
            🔑 {isUrdu ? 'ڈیش بورڈ میں لاگ ان کریں' : 'Log In to Dashboard'}
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {dashboardFeatures.map((feat, idx) => (
            <div key={idx} className="bg-navy-950/80 p-4 rounded-xl border border-navy-800 text-left">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{feat.icon}</span>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {isUrdu ? feat.title_ur : feat.title_en}
                </h3>
              </div>
              <p className={`text-navy-300 text-xs sm:text-sm leading-relaxed ${isUrdu ? 'font-urdu' : ''}`}>
                {isUrdu ? feat.desc_ur : feat.desc_en}
              </p>
            </div>
          ))}
        </div>

        <div className="p-4 bg-shield-950/60 rounded-xl border border-shield-500/40 text-xs sm:text-sm text-shield-200">
          <p className="font-bold mb-1">💡 Quick Setup Guide for Teachers:</p>
          <ol className="list-decimal pl-5 space-y-1 text-navy-200">
            <li>Go to the Teacher Dashboard (<Link to="/teacher" className="underline text-shield-300">/teacher</Link>).</li>
            <li>Enter default passphrase: <code className="text-shield-400 font-bold font-mono">hifazat123</code>.</li>
            <li>Click <strong>"Load Demo Evidence"</strong> to preview sample charts, or have your students play through levels to record real student attempts automatically.</li>
            <li>Click <strong>"Export CSV Evidence"</strong> to download the spreadsheet for your STREAM project report.</li>
          </ol>
        </div>
      </div>

      {/* Section 3: Community Safety Action */}
      <div className="card p-6 sm:p-8 mb-12">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center gap-2">
          <span>👨‍👩‍👧‍👦</span>
          <span>{isUrdu ? 'کمیونٹی سیفٹی اور فیملی پارٹنرشپ' : 'Community Safety Action & Family Engagement'}</span>
        </h2>
        <p className="text-navy-200 text-xs sm:text-sm mb-6 leading-relaxed">
          {isUrdu
            ? 'سائبر حفاظت صرف اسکول تک محدود نہیں ہونی چاہیے۔ طلباء کو اپنے والدین اور محلے کے لیے ڈیجیٹل محافظ بننے کی ترغیب دیں۔'
            : 'Cyber defense should extend beyond the classroom. The STREAM curriculum emphasizes active community stewardship by involving families directly.'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-4 bg-navy-950/80 rounded-xl border border-navy-800">
            <h3 className="font-bold text-shield-400 mb-1">🖨️ Printable Family Pledge Cards</h3>
            <p className="text-navy-300">
              Inside the Teacher Dashboard, click <strong>"Family Cards"</strong> to print pocket-sized safety cards for students to paste near home computers and routers.
            </p>
          </div>
          <div className="p-4 bg-navy-950/80 rounded-xl border border-navy-800">
            <h3 className="font-bold text-shield-400 mb-1">🗣️ Family Safe Word Drill</h3>
            <p className="text-navy-300">
              Teach students to establish an offline family secret word with their parents to defeat AI voice cloning and emergency impersonation scams.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation CTAs */}
      <div className="text-center flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/teacher" className="btn-primary text-base sm:text-lg py-3 px-8">
          <span>📊</span>
          <span>{isUrdu ? 'اساتذہ ڈیش بورڈ پر جائیں' : 'Go to Teacher Dashboard'}</span>
        </Link>
        <Link to="/levels" className="btn-secondary text-base">
          <span>🎮</span>
          <span>{isUrdu ? 'ڈوجو لیولز کھیلیں' : 'Play Dojo Challenge'}</span>
        </Link>
      </div>
    </div>
  );
}
