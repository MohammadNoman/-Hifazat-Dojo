import { useGame } from '../store/GameContext';
import SafetyWarning from '../components/SafetyWarning';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  const { language } = useGame();
  const isUrdu = language === 'ur';

  const topics = [
    {
      icon: '🎣',
      title_en: 'What is Phishing? (فشنگ کیا ہے؟)',
      summary_en:
        'Phishing is a deceptive technique where attackers send fake emails, SMS, or direct messages pretending to be trusted organizations (like schools, banks, or game platforms). Their goal is to trick you into revealing passwords, credit card numbers, or clicking malicious links.',
      summary_ur:
        'فشنگ ایک دھوکہ دہی کا طریقہ ہے جس میں حملہ آور خود کو معتبر ادارہ (جیسے اسکول، بینک، یا گیم پلیٹ فارم) ظاہر کر کے جعلی ای میل، میسج یا لنک بھیجتے ہیں تاکہ آپ کا پاس ورڈ یا راز چرا سکیں۔',
      habits_en: [
        'Check sender URLs carefully for spelling tricks (e.g. g00gle.com instead of google.com).',
        'Never click urgent links claiming your account will be deleted immediately.',
        'Always verify with an official teacher, parent, or direct official portal.',
      ],
      habits_ur: [
        'لنک کے ہجے (spelling) غور سے چیک کریں کہ اصلی ویب سائٹ ہے یا جعلی۔',
        'فوری طور پر اکاؤنٹ بند ہونے والی دھمکی آمیز لنکس پر کبھی کلک نہ کریں۔',
        'ہمیشہ اپنے استاد، والدین یا اصل سرکاری ہیلپ لائن سے تصدیق کریں۔',
      ],
    },
    {
      icon: '🔑',
      title_en: 'OTP & Verification Code Fraud (ون ٹائم پاس ورڈ فراڈ)',
      summary_en:
        'A One-Time Password (OTP) or temporary SMS verification code is meant EXCLUSIVELY for you to authenticate your action. Scammers often call claiming they are technical support or bank staff needing the code to "fix" or "verify" your account.',
      summary_ur:
        'او ٹی پی (OTP) یا عارضی تصدیقی کوڈ صرف آپ کے ذاتی استعمال کے لیے ہوتا ہے۔ دھوکے باز اکثر خود کو ہیلپ ڈیسک یا بینک نمائندہ ظاہر کر کے یہ کوڈ مانگتے ہیں تاکہ آپ کا اکاؤنٹ لوٹ سکیں۔',
      habits_en: [
        'No legitimate bank, school, or app support agent will EVER ask for your OTP.',
        'Never forward or read aloud verification SMS codes over a phone call or chat.',
        'Treat OTPs just like you treat the physical key to your house.',
      ],
      habits_ur: [
        'کوئی بھی اصلی بینک، اسکول یا ادارہ فون یا میسج پر آپ کا OTP کبھی نہیں مانگتا۔',
        'کال یا چیٹ پر کبھی بھی اپنا تصدیقی کوڈ کسی کو پڑھ کر نہ سنائیں۔',
        'اپنے OTP کو اپنے گھر کی ذاتی چابی کی طرح محفوظ رکھیں۔',
      ],
    },
    {
      icon: '🔒',
      title_en: 'Password Safety & Strong Credentials (پاس ورڈ کی حفاظت)',
      summary_en:
        'Weak or reused passwords make accounts easy targets. Attackers use automated tools to guess common passwords like "123456", "password", or family names.',
      summary_ur:
        'کمزور یا ایک ہی پاس ورڈ تمام اکاؤنٹس پر رکھنا خطرے کی علامت ہے۔ حملہ آور آسان پاس ورڈز جیسے کہ تاریخ پیدائش یا "123456" آسانی سے توڑ لیتے ہیں۔',
      habits_en: [
        'Create passphrases using 3 to 4 random words combined with numbers and symbols.',
        'Never use the same password across multiple platforms.',
        'Turn on 2-Step Verification (Two-Factor Authentication / 2FA) wherever available.',
      ],
      habits_ur: [
        'تین یا چار بے ترتیب الفاظ، نمبرز اور علامات ملا کر مضبوط پاس ورڈ بنائیں۔',
        'تمام اکاؤنٹس پر ایک جیسا پاس ورڈ کبھی مت رکھیں۔',
        'جہاں ممکن ہو ٹو-اسٹیپ ویریفکیشن (2FA) لازمی آن کریں۔',
      ],
    },
    {
      icon: '🚨',
      title_en: 'Safe Reporting & Community Action (محفوظ رپورٹنگ اور فوری اقدام)',
      summary_en:
        'If you or someone in your community encounters a scam attempt or falls victim to cyberfraud, taking calm and verified action is essential.',
      summary_ur:
        'اگر آپ یا آپ کا کوئی جاننے والا کسی آن لائن فراڈ کا سامنا کرے تو گھبرانے کے بجائے صحیح طریقہ کار اختیار کرنا ضروری ہے۔',
      habits_en: [
        'Do not panic and do not delete the evidence. Take clear screenshots of messages and numbers.',
        'Immediately block the suspicious caller or profile.',
        'Notify a trusted family member, guardian, or school cyber safety coordinator.',
        'Report to national cybersecurity authorities through verified official hotlines.',
      ],
      habits_ur: [
        'گھبرائیں نہیں اور ثبوت ضائع نہ کریں؛ مشکوک میسج اور نمبر کا اسکرین شاٹ لیں۔',
        'مشکوک نمبر یا پروفائل کو فوراً بلاک کریں۔',
        'اپنے والدین، اساتذہ یا اسکول کے سائبر کوآرڈینیٹر کو مطلع کریں۔',
        'قومی سائبر کرائم رپورٹنگ چینلز (جیسے ہیلپ لائن 1991) پر رپورٹ کریں۔',
      ],
    },
  ];

  return (
    <div className={`page-container ${isUrdu ? 'rtl' : ''}`}>
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="section-title">
          {isUrdu ? '🛡️ سائبر آگاہی اور حفاظتی گائیڈ' : '🛡️ Cyber Safety & Awareness Guide'}
        </h1>
        <p className="text-navy-300 text-lg max-w-2xl mx-auto">
          {isUrdu
            ? 'حفاظت ڈوجو کا مقصد نوجوانوں اور کمیونٹی کو آن لائن دھوکہ دہی، فشنگ اور پاس ورڈ فراڈ سے بچانا ہے۔'
            : 'Hifazat Dojo is dedicated to empowering students, teachers, and communities against phishing, scams, and digital exploitation.'}
        </p>
      </div>

      {/* Safety Warning */}
      <div className="max-w-3xl mx-auto mb-10">
        <SafetyWarning />
      </div>

      {/* Core Safety Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
        {topics.map((topic, idx) => (
          <div key={idx} className="card hover:ring-1 hover:ring-shield-400/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl p-2 bg-navy-700/60 rounded-xl">{topic.icon}</span>
                <h2 className="text-xl font-bold text-white leading-tight">
                  {topic.title_en}
                </h2>
              </div>
              <p className="text-navy-200 text-sm md:text-base mb-4 leading-relaxed">
                {isUrdu ? topic.summary_ur : topic.summary_en}
              </p>
              <h3 className="text-xs uppercase tracking-wider text-shield-400 font-semibold mb-2">
                {isUrdu ? 'اہم حفاظتی عادات:' : 'Essential Habits:'}
              </h3>
              <ul className="space-y-2 text-sm text-navy-200">
                {(isUrdu ? topic.habits_ur : topic.habits_en).map((habit, hIdx) => (
                  <li key={hIdx} className="flex items-start gap-2">
                    <span className="text-shield-400 mt-0.5">✓</span>
                    <span>{habit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Community Action Section */}
      <div className="card-glow max-w-4xl mx-auto p-8 mb-12">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl">🏛️</span>
          <div>
            <h2 className="text-2xl font-bold text-white">
              {isUrdu ? 'کمیونٹی سیفٹی اور مصدقہ رپورٹنگ فورمز' : 'Community Safety & Official Reporting Channels'}
            </h2>
            <p className="text-navy-300 text-sm">
              {isUrdu
                ? 'کسی بھی حقیقی دھوکے کی صورت میں سرکاری چینلز سے رابطہ کریں:'
                : 'In real life, report cybercrimes directly through authorized regulatory helplines:'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-navy-700/60">
          <div className="glass p-4 rounded-xl text-center">
            <p className="text-shield-400 font-bold text-lg mb-1">FIA Cyber Crime Wing</p>
            <p className="text-white text-xl font-black">Helpline 1991</p>
            <p className="text-xs text-navy-400 mt-1">cybercrime.gov.pk</p>
          </div>
          <div className="glass p-4 rounded-xl text-center">
            <p className="text-shield-400 font-bold text-lg mb-1">PTA Redressal</p>
            <p className="text-white text-xl font-black">Toll-Free 0800-55055</p>
            <p className="text-xs text-navy-400 mt-1">Spam & Stolen SIM Reporting</p>
          </div>
          <div className="glass p-4 rounded-xl text-center">
            <p className="text-shield-400 font-bold text-lg mb-1">State Bank Helpline</p>
            <p className="text-white text-xl font-black">111-727-273</p>
            <p className="text-xs text-navy-400 mt-1">Unauthorized Banking Transactions</p>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation */}
      <div className="text-center flex justify-center gap-4">
        <Link to="/levels" className="btn-primary">
          {isUrdu ? '🎮 گیم ڈوجو میں کھیلیں' : '🎮 Play in Dojo'}
        </Link>
        <Link to="/" className="btn-secondary">
          {isUrdu ? 'ہوم پیج' : 'Home Page'}
        </Link>
      </div>
    </div>
  );
}
