import { useState, useMemo } from 'react';
import { useGame, loadTeacherData, clearTeacherData, saveTeacherRecord } from '../store/GameContext';
import SafetyWarning from '../components/SafetyWarning';
import { LEVELS } from '../data/questions';

const DEFAULT_PASSPHRASE = 'hifazat123';
const PASSPHRASE_KEY = 'hifazat_teacher_passphrase';

export default function TeacherPage() {
  const { language } = useGame();
  const isUrdu = language === 'ur';

  const [enteredPassphrase, setEnteredPassphrase] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [records, setRecords] = useState(() => loadTeacherData());
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [printCard, setPrintCard] = useState(false);
  const [showChangePass, setShowChangePass] = useState(false);
  const [newPassphrase, setNewPassphrase] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  function getActivePassphrase() {
    return localStorage.getItem(PASSPHRASE_KEY) || DEFAULT_PASSPHRASE;
  }

  function handleLogin(e) {
    e.preventDefault();
    if (enteredPassphrase === getActivePassphrase()) {
      setIsAuthenticated(true);
      setErrorMsg('');
      setRecords(loadTeacherData());
    } else {
      setErrorMsg(isUrdu ? 'غلط پاس فریز! دوبارہ کوشش کریں۔' : 'Incorrect passphrase! Default is hifazat123.');
    }
  }

  function handleReset() {
    clearTeacherData();
    setRecords([]);
    setShowResetConfirm(false);
  }

  function handleChangePass(e) {
    e.preventDefault();
    if (newPassphrase.trim().length >= 4) {
      localStorage.setItem(PASSPHRASE_KEY, newPassphrase.trim());
      setPassSuccess(isUrdu ? 'پاس فریز کامیابی سے تبدیل ہو گیا!' : 'Passphrase updated successfully!');
      setShowChangePass(false);
      setNewPassphrase('');
      setTimeout(() => setPassSuccess(''), 4000);
    } else {
      alert(isUrdu ? 'پاس فریز کم از کم ۴ حروف پر مشتمل ہونا چاہیے۔' : 'Passphrase must be at least 4 characters long.');
    }
  }

  // Pre-populate realistic anonymous exhibition sample data if classroom hasn't taken tests yet
  function loadSampleData() {
    const sample = [
      {
        level: 1,
        levelName: 'Aasaan Hifazat',
        score: 90,
        correct: 9,
        total: 10,
        passed: true,
        maxStreak: 6,
        wrongCategories: ['Lucky Prize Message'],
        date: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        level: 1,
        levelName: 'Aasaan Hifazat',
        score: 70,
        correct: 7,
        total: 10,
        passed: true,
        maxStreak: 4,
        wrongCategories: ['Urgent Account Warning', 'Fake Survey Reward', 'Friend\'s New Number'],
        date: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        level: 2,
        levelName: 'Hoshiyar Hifazat',
        score: 80,
        correct: 8,
        total: 10,
        passed: true,
        maxStreak: 5,
        wrongCategories: ['One-Time Code Request', 'Fake Delivery Fee'],
        date: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        level: 2,
        levelName: 'Hoshiyar Hifazat',
        score: 60,
        correct: 6,
        total: 10,
        passed: false,
        maxStreak: 3,
        wrongCategories: ['One-Time Code Request', 'Look-Alike School Link', 'Quiz Form with Secrets', 'Wallet Refund Trap'],
        date: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        level: 3,
        levelName: 'Expert Hifazat',
        score: 85,
        correct: 8,
        total: 10,
        passed: true,
        maxStreak: 4,
        wrongCategories: ['Guaranteed Investment Return', 'Screenshot Proof Demand'],
        date: new Date().toISOString(),
      },
      {
        level: 4,
        levelName: 'Community Guardian',
        score: 100,
        correct: 10,
        total: 10,
        passed: true,
        maxStreak: 10,
        wrongCategories: [],
        date: new Date().toISOString(),
      },
    ];

    sample.forEach((item) => saveTeacherRecord(item));
    setRecords(loadTeacherData());
  }

  // Analytics computation
  const stats = useMemo(() => {
    const totalSessions = records.length;
    if (totalSessions === 0) {
      return {
        totalSessions: 0,
        averageScore: 0,
        passRate: 0,
        levelCounts: { 1: 0, 2: 0, 3: 0, 4: 0 },
        categoryErrors: {},
      };
    }

    let scoreSum = 0;
    let passedCount = 0;
    const levelCounts = { 1: 0, 2: 0, 3: 0, 4: 0 };
    const categoryErrors = {};

    records.forEach((r) => {
      scoreSum += r.score || 0;
      if (r.passed) passedCount++;
      if (levelCounts[r.level] !== undefined) {
        levelCounts[r.level]++;
      }
      if (Array.isArray(r.wrongCategories)) {
        r.wrongCategories.forEach((cat) => {
          categoryErrors[cat] = (categoryErrors[cat] || 0) + 1;
        });
      }
    });

    const averageScore = Math.round(scoreSum / totalSessions);
    const passRate = Math.round((passedCount / totalSessions) * 100);

    return {
      totalSessions,
      averageScore,
      passRate,
      levelCounts,
      categoryErrors,
    };
  }, [records]);

  // Robust UTF-8 CSV Export with Blob for STREAM Project Portfolio evidence
  function exportCSV() {
    if (records.length === 0) {
      alert(isUrdu ? 'کوئی ڈیٹا موجود نہیں ہے' : 'No records available to export.');
      return;
    }

    const headers = [
      'Session #',
      'Date & Time',
      'Level #',
      'Level Name',
      'Score (/100)',
      'Correct Answers (/10)',
      'Status (Passed/Review)',
      'Best Streak',
      'Mistake Categories (Needs Classroom Focus)',
    ];

    const rows = records.map((r, i) => {
      const dateStr = r.date ? new Date(r.date).toLocaleString('en-GB') : 'N/A';
      const mistakes = Array.isArray(r.wrongCategories) && r.wrongCategories.length > 0
        ? `"${r.wrongCategories.join('; ')}"`
        : '"None (Perfect Score)"';

      return [
        i + 1,
        `"${dateStr}"`,
        r.level,
        `"${r.levelName || ''}"`,
        r.score,
        r.correct,
        r.passed ? 'Passed (Unlocked)' : 'Needs Review',
        r.maxStreak || 0,
        mistakes,
      ].join(',');
    });

    const BOM = '\uFEFF';
    const csvContent = BOM + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Hifazat_Dojo_Class_Evidence_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Passphrase Login View
  if (!isAuthenticated) {
    return (
      <div className={`page-container max-w-md ${isUrdu ? 'rtl' : ''}`}>
        <div className="card text-center p-6 sm:p-8 mt-8 sm:mt-12 animate-fade-in border-shield-500/40">
          <div className="text-5xl mb-3">🔐</div>
          <h1 className="text-2xl font-extrabold text-white mb-2">
            {isUrdu ? 'اساتذہ ڈیش بورڈ' : 'Teacher Dashboard'}
          </h1>
          <p className="text-navy-300 text-xs sm:text-sm mb-6">
            {isUrdu
              ? 'کلاس کی گمنام کارکردگی اور STREAM پروجیکٹ کے شواہد تک رسائی کے لیے لوکل پاس فریز درج کریں۔'
              : 'Enter the local teacher passphrase to inspect anonymous class metrics and export STREAM project evidence.'}
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={enteredPassphrase}
                onChange={(e) => setEnteredPassphrase(e.target.value)}
                placeholder={isUrdu ? 'پاس فریز درج کریں' : 'Enter Passphrase (default: hifazat123)'}
                className="w-full bg-navy-900 border border-navy-700 rounded-xl px-4 py-3 text-white text-center text-base focus:outline-none focus:ring-2 focus:ring-shield-400"
                autoFocus
              />
            </div>

            {errorMsg && <p className="text-danger-400 text-xs sm:text-sm font-semibold">{errorMsg}</p>}

            <button type="submit" className="btn-primary w-full">
              {isUrdu ? 'ڈیش بورڈ کھولیں 🔓' : 'Unlock Dashboard 🔓'}
            </button>
          </form>

          <div className="bg-navy-900/60 p-3 rounded-xl mt-6 border border-navy-700/60 text-xs text-navy-400">
            <p>💡 Default Passphrase: <code className="text-shield-400 font-mono font-bold">hifazat123</code></p>
            <p className="text-[11px] mt-1 text-navy-500">Stored strictly offline in browser localStorage.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`page-container ${isUrdu ? 'rtl' : ''}`}>
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl sm:text-3xl">📊</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isUrdu ? 'اساتذہ ڈیش بورڈ اور تجزیات' : 'Teacher Dashboard & Project Analytics'}
            </h1>
          </div>
          <p className="text-navy-300 text-xs sm:text-sm">
            {isUrdu
              ? 'گمنام طلباء کی کارکردگی اور STREAM پروجیکٹ کے شواہد (محفوظ لوکل اسٹوریج)'
              : 'Anonymous student performance & STREAM project evidence (Protected LocalStorage)'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {records.length === 0 && (
            <button onClick={loadSampleData} className="btn-secondary text-xs sm:text-sm py-2 px-3 bg-blue-900/50 hover:bg-blue-800">
              ⚡ {isUrdu ? 'ڈیمو ڈیٹا لوڈ کریں' : 'Load Demo Evidence'}
            </button>
          )}

          <button onClick={exportCSV} className="btn-primary text-xs sm:text-sm py-2 px-3 sm:px-4">
            📥 {isUrdu ? 'CSV ڈاؤن لوڈ کریں' : 'Export CSV Evidence'}
          </button>

          <button
            onClick={() => setPrintCard(!printCard)}
            className="btn-secondary text-xs sm:text-sm py-2 px-3"
          >
            🖨️ {isUrdu ? 'فیملی کارڈ' : 'Family Cards'}
          </button>

          <button
            onClick={() => setShowChangePass(!showChangePass)}
            className="btn-secondary text-xs sm:text-sm py-2 px-3"
          >
            🔑 {isUrdu ? 'پاس فریز' : 'Passphrase'}
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="btn-danger text-xs sm:text-sm py-2 px-3"
          >
            🗑️ {isUrdu ? 'ڈیٹا صاف' : 'Reset'}
          </button>
        </div>
      </div>

      {passSuccess && (
        <div className="bg-shield-900/40 border border-shield-500 text-shield-200 text-xs sm:text-sm p-3 rounded-xl mb-4">
          ✅ {passSuccess}
        </div>
      )}

      {/* Change Passphrase Sub-panel */}
      {showChangePass && (
        <div className="card mb-6 border-blue-500/40 p-4">
          <h3 className="text-sm font-bold text-white mb-2">
            {isUrdu ? 'نیا اساتذہ پاس فریز مقرر کریں' : 'Change Teacher Passphrase'}
          </h3>
          <form onSubmit={handleChangePass} className="flex flex-col sm:flex-row gap-2 max-w-md">
            <input
              type="text"
              value={newPassphrase}
              onChange={(e) => setNewPassphrase(e.target.value)}
              placeholder="New passphrase (min 4 chars)"
              className="bg-navy-900 border border-navy-700 px-3 py-1.5 rounded-lg text-sm text-white flex-1"
            />
            <button type="submit" className="btn-primary text-xs py-2 px-4">
              {isUrdu ? 'محفوظ کریں' : 'Save'}
            </button>
          </form>
        </div>
      )}

      <div className="mb-6">
        <SafetyWarning />
      </div>

      {/* High-Level Metric Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="card text-center p-4">
          <p className="text-navy-400 text-[11px] sm:text-xs uppercase tracking-wider font-semibold mb-1">
            {isUrdu ? 'کل سیشنز' : 'Total Sessions'}
          </p>
          <p className="text-3xl sm:text-4xl font-black text-white">{stats.totalSessions}</p>
          <p className="text-[10px] sm:text-xs text-navy-400 mt-1">
            {isUrdu ? 'طالب علم کی مشقیں' : 'Anonymous attempts'}
          </p>
        </div>

        <div className="card text-center p-4">
          <p className="text-navy-400 text-[11px] sm:text-xs uppercase tracking-wider font-semibold mb-1">
            {isUrdu ? 'اوسط سکور' : 'Class Average'}
          </p>
          <p className="text-3xl sm:text-4xl font-black text-shield-400">{stats.averageScore}/100</p>
          <p className="text-[10px] sm:text-xs text-navy-400 mt-1">
            {stats.averageScore >= 70 ? '🎯 Target Mastered' : 'Needs reinforcement'}
          </p>
        </div>

        <div className="card text-center p-4">
          <p className="text-navy-400 text-[11px] sm:text-xs uppercase tracking-wider font-semibold mb-1">
            {isUrdu ? 'کامیابی کی شرح' : 'Pass Rate (70%+)'}
          </p>
          <p className="text-3xl sm:text-4xl font-black text-blue-400">{stats.passRate}%</p>
          <p className="text-[10px] sm:text-xs text-navy-400 mt-1">
            {isUrdu ? 'لیول پاس کرنے کی شرح' : 'Mastery threshold met'}
          </p>
        </div>

        <div className="card text-center p-4">
          <p className="text-navy-400 text-[11px] sm:text-xs uppercase tracking-wider font-semibold mb-1">
            {isUrdu ? 'سب سے عام غلطی' : 'Top Error Pattern'}
          </p>
          <p className="text-sm sm:text-base font-bold text-amber-400 truncate mt-2">
            {Object.keys(stats.categoryErrors).length > 0
              ? Object.entries(stats.categoryErrors).sort((a, b) => b[1] - a[1])[0][0]
              : 'None'}
          </p>
          <p className="text-[10px] sm:text-xs text-navy-400 mt-1">
            {Object.keys(stats.categoryErrors).length > 0 ? 'Focus for class talk' : 'Zero errors recorded'}
          </p>
        </div>
      </div>

      {/* Level Breakdown & Common Mistake Diagnostics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
        <div className="card">
          <h2 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>📈</span>
            <span>{isUrdu ? 'لیول کے لحاظ سے شمولیت' : 'Level Participation Breakdown'}</span>
          </h2>
          <div className="space-y-4">
            {LEVELS.map((lvl) => {
              const count = stats.levelCounts[lvl.id] || 0;
              const percent = stats.totalSessions ? Math.round((count / stats.totalSessions) * 100) : 0;
              return (
                <div key={lvl.id}>
                  <div className="flex justify-between text-xs sm:text-sm mb-1">
                    <span className="text-navy-200">
                      {lvl.icon} {isUrdu ? lvl.name_ur : lvl.name_en}
                    </span>
                    <span className="text-shield-400 font-bold">
                      {count} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-navy-900 rounded-full h-2 overflow-hidden border border-navy-700/50">
                    <div
                      className="bg-shield-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <h2 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>⚠️</span>
            <span>{isUrdu ? 'کلاس میں توجہ طلب غلطیاں' : 'Common Misconception Categories'}</span>
          </h2>
          {Object.keys(stats.categoryErrors).length === 0 ? (
            <p className="text-navy-400 text-xs sm:text-sm italic py-8 text-center">
              {isUrdu
                ? 'ابھی کوئی غلطی ریکارڈ نہیں ہوئی۔ طلباء کے ٹیسٹ دینے کے بعد یہاں تجزیہ نظر آئے گا۔'
                : 'No mistake patterns logged yet. As students take quizzes, common error topics will appear here for classroom discussion.'}
            </p>
          ) : (
            <div className="space-y-2.5">
              {Object.entries(stats.categoryErrors)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 6)
                .map(([cat, count], idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-navy-900/60 text-xs sm:text-sm">
                    <span className="text-navy-100 flex items-center gap-2">
                      <span className="text-danger-400">●</span> {cat}
                    </span>
                    <span className="text-danger-300 font-bold bg-danger-900/40 px-2 py-0.5 rounded text-xs">
                      {count} {isUrdu ? 'غلطیاں' : 'mistakes'}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Community Safety Action & Printable Family Pledge Card */}
      <div className="card-glow p-4 sm:p-6 mb-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl">👨‍👩‍👧‍👦</span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {isUrdu ? 'کمیونٹی سیفٹی ایکشن پلان' : 'Community Safety Action Plan'}
              </h2>
              <p className="text-navy-300 text-xs">
                {isUrdu
                  ? 'طلباء کے ذریعے خاندان اور محلے میں آگاہی پھیلانے کا طریقہ کار'
                  : 'Empowering students to take cybersecurity habits from classroom to their households.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => window.print()}
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 no-print"
          >
            <span>🖨️</span>
            <span>Print Cards</span>
          </button>
        </div>

        {/* Printable Family Cards Component */}
        <div className={`p-4 bg-white text-navy-950 rounded-xl border-2 border-dashed border-shield-600 ${printCard ? 'block' : 'hidden sm:block'}`}>
          <div className="text-center mb-3">
            <h3 className="text-base sm:text-lg font-black text-navy-900">
              🛡️ HIFAZAT DOJO — FAMILY CYBER-SAFETY PLEDGE CARD
            </h3>
            <p className="text-[11px] text-navy-600">
              Cut along the dashed border and keep near your family computer, router, or refrigerator.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="border border-navy-200 p-2.5 rounded bg-slate-50">
              <p className="font-bold text-navy-900 mb-1">✅ 3 GOLDEN FAMILY RULES:</p>
              <ol className="list-decimal pl-4 space-y-1 text-navy-700">
                <li>Never share SMS OTPs, bank PINs, or unlock codes over a phone call.</li>
                <li>Verify urgent emergency money requests through a known saved family contact.</li>
                <li>Do not click unknown links promising lottery prizes, jobs, or free tablets.</li>
              </ol>
            </div>
            <div className="border border-navy-200 p-2.5 rounded bg-slate-50">
              <p className="font-bold text-navy-900 mb-1">🚨 VERIFIED OFFICIAL HELPLINES:</p>
              <p className="text-navy-700">FIA Cyber Crime Wing: <strong>1991</strong></p>
              <p className="text-navy-700">PTA Stolen SIM / Fraud Helpline: <strong>0800-55055</strong></p>
              <p className="text-navy-700">State Bank Banking Fraud: <strong>111-727-273</strong></p>
              <p className="text-[10px] text-navy-500 mt-1">STREAM School Awareness Initiative</p>
            </div>
          </div>
        </div>
      </div>

      {/* Anonymous Recent Session Log Table */}
      <div className="card">
        <h2 className="text-base sm:text-lg font-bold text-white mb-3 flex items-center justify-between">
          <span>📋 {isUrdu ? 'حالیہ فرضی سیشن ریکارڈز' : 'Recent Anonymous Session Log'}</span>
          <span className="text-xs text-navy-400 font-normal">
            {records.length} {isUrdu ? 'ریکارڈز محفوظ' : 'entries recorded'}
          </span>
        </h2>

        {records.length === 0 ? (
          <p className="text-navy-400 text-xs sm:text-sm italic py-6 text-center">
            {isUrdu
              ? 'ابھی کوئی سیشن مکمل نہیں ہوا ہے۔ اوپر "ڈیمو ڈیٹا لوڈ کریں" پر کلک کر کے نمونہ چیک کریں۔'
              : 'No student sessions recorded yet. Play a level or click "Load Demo Evidence" above to inspect.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-navy-200">
              <thead className="bg-navy-900/90 text-navy-400 uppercase text-[10px] sm:text-xs">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Level</th>
                  <th className="py-2.5 px-3">Score</th>
                  <th className="py-2.5 px-3">Correct</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Streak</th>
                  <th className="py-2.5 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-700/50">
                {records.slice(-12).reverse().map((rec, i) => (
                  <tr key={i} className="hover:bg-navy-700/30 transition-colors">
                    <td className="py-2 px-3 font-mono text-xs text-navy-400">{i + 1}</td>
                    <td className="py-2 px-3 font-semibold text-white">{rec.levelName || `Level ${rec.level}`}</td>
                    <td className="py-2 px-3 font-black text-shield-400">{rec.score}/100</td>
                    <td className="py-2 px-3">{rec.correct}/10</td>
                    <td className="py-2 px-3">
                      {rec.passed ? (
                        <span className="bg-shield-500/20 text-shield-300 border border-shield-500/40 px-2 py-0.5 rounded text-[11px] font-bold">
                          Passed
                        </span>
                      ) : (
                        <span className="bg-danger-500/20 text-danger-300 border border-danger-500/40 px-2 py-0.5 rounded text-[11px] font-bold">
                          Review
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-amber-400 font-mono">{rec.maxStreak || 0}</td>
                    <td className="py-2 px-3 text-[11px] text-navy-400">
                      {rec.date ? new Date(rec.date).toLocaleDateString('en-GB') : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Safety Confirmation Modal for Reset */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="card max-w-sm w-full text-center p-6 border-danger-500/50 shadow-2xl">
            <div className="text-4xl mb-3">⚠️</div>
            <h3 className="text-lg font-bold text-white mb-2">
              {isUrdu ? 'کیا آپ تمام ڈیٹا صاف کرنا چاہتے ہیں؟' : 'Erase All Classroom Records?'}
            </h3>
            <p className="text-navy-300 text-xs sm:text-sm mb-6">
              {isUrdu
                ? 'یہ تمام محفوظ کردہ سیشن ریکارڈز کو اس براؤزر سے ڈیلیٹ کر دے گا۔'
                : 'This will permanently remove all stored student quiz logs from this browser.'}
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setShowResetConfirm(false)} className="btn-secondary text-xs py-2 px-4">
                {isUrdu ? 'منسوخ' : 'Cancel'}
              </button>
              <button onClick={handleReset} className="btn-danger text-xs py-2 px-4">
                {isUrdu ? 'ہاں، ڈیلیٹ کریں' : 'Yes, Erase'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
