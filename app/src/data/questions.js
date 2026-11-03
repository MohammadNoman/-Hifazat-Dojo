import questionsData from './questions.json';

export const LEVELS = [
  {
    id: 1,
    name_en: 'Aasaan Hifazat',
    name_ur: 'آسان حفاظت',
    subtitle_en: 'Easy – Class 6-7',
    subtitle_ur: 'آسان – جماعت ۶-۷',
    theme_en: 'Password Safety',
    theme_ur: 'پاس ورڈ حفاظت',
    badge_en: 'Password Protector',
    badge_ur: 'پاس ورڈ پروٹیکٹر',
    color: 'from-shield-600 to-shield-400',
    icon: '🛡️',
  },
  {
    id: 2,
    name_en: 'Hoshiyar Hifazat',
    name_ur: 'ہوشیار حفاظت',
    subtitle_en: 'Medium – Class 8-9',
    subtitle_ur: 'درمیانہ – جماعت ۸-۹',
    theme_en: 'Phishing Awareness',
    theme_ur: 'فشنگ سے آگاہی',
    badge_en: 'Phish Finder',
    badge_ur: 'فش فائنڈر',
    color: 'from-blue-600 to-blue-400',
    icon: '🔍',
  },
  {
    id: 3,
    name_en: 'Expert Hifazat',
    name_ur: 'ایکسپرٹ حفاظت',
    subtitle_en: 'Hard – Class 10',
    subtitle_ur: 'مشکل – جماعت ۱۰',
    theme_en: 'Money Scams',
    theme_ur: 'مالی دھوکے',
    badge_en: 'Scam Stopper',
    badge_ur: 'سکیم سٹاپر',
    color: 'from-purple-600 to-purple-400',
    icon: '⚔️',
  },
  {
    id: 4,
    name_en: 'Community Guardian',
    name_ur: 'کمیونٹی گارڈین',
    subtitle_en: 'Very Hard – Teachers, Parents, Adults',
    subtitle_ur: 'بہت مشکل – اساتذہ، والدین، بالغ',
    theme_en: 'Community Reporting',
    theme_ur: 'کمیونٹی رپورٹنگ',
    badge_en: 'Community Guardian',
    badge_ur: 'کمیونٹی گارڈین',
    color: 'from-amber-600 to-amber-400',
    icon: '🏆',
  },
];

export function getQuestionsByLevel(level) {
  return questionsData.questions.filter((q) => q.level === level);
}

export function getAppTitle() {
  return questionsData.app_title;
}

export function getOfflineNotice() {
  return questionsData.offline_notice;
}

export const SAFETY_WARNING =
  'Ye app sirf training ke liye hai. Asli OTP, password, CNIC ya bank details kisi ko share na karein.';

export const SAFETY_WARNING_UR =
  'یہ ایپ صرف ٹریننگ کے لیے ہے۔ اصلی OTP، پاس ورڈ، CNIC یا بینک ڈیٹیلز کسی کو شیئر نہ کریں۔';

export const PASSING_SCORE = 7; // 7 out of 10 = 70%
export const TOTAL_QUESTIONS = 10;
export const POINTS_CORRECT = 10;
export const POINTS_LEARNING = 3;
