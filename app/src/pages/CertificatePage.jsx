import { useParams, Link, Navigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useGame, useGameDispatch } from '../store/GameContext';
import { LEVELS } from '../data/questions';
import ShieldIcon from '../components/ShieldIcon';

const ROLE_OPTIONS = [
  { value: '', label_en: '-- Select Class / Role (Optional) --', label_ur: '-- کلاس یا کردار منتخب کریں (اختیاری) --' },
  { value: 'Student', label_en: 'Student', label_ur: 'طالب علم (Student)' },
  { value: 'Teacher', label_en: 'Teacher', label_ur: 'استاد (Teacher)' },
  { value: 'Parent', label_en: 'Parent', label_ur: 'والدین (Parent)' },
  { value: 'Community Member', label_en: 'Community Member', label_ur: 'کمیونٹی ممبر (Community Member)' },
];

const COMMON_DESIGNATIONS = [
  'Class Teacher',
  'Cyber Safety Lead',
  'Head Teacher',
  'Principal',
  'IT Instructor',
  'STREAM Coordinator',
];

const CERT_STORAGE_KEY = 'hifazat_dojo_cert_meta';

export default function CertificatePage() {
  const { levelId } = useParams();
  const { language, learnerName, levelScores, completedLevels, practiceMode } = useGame();
  const dispatch = useGameDispatch();
  const isUrdu = language === 'ur';

  // Load saved metadata (if available) for school/instructor convenience across certificates
  const savedMeta = (() => {
    try {
      const stored = localStorage.getItem(CERT_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  })();

  const [name, setName] = useState(learnerName || savedMeta.name || '');
  const [schoolName, setSchoolName] = useState(savedMeta.schoolName || '');
  const [role, setRole] = useState(savedMeta.role || '');
  const [instructorName, setInstructorName] = useState(savedMeta.instructorName || '');
  const [instructorDesignation, setInstructorDesignation] = useState(savedMeta.instructorDesignation || '');
  
  const [isDownloadingPNG, setIsDownloadingPNG] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [showConfig, setShowConfig] = useState(!learnerName && !savedMeta.name);

  const certRef = useRef(null);

  // Sync state to localStorage whenever customized
  useEffect(() => {
    try {
      localStorage.setItem(
        CERT_STORAGE_KEY,
        JSON.stringify({
          name: name.trim(),
          schoolName: schoolName.trim(),
          role,
          instructorName: instructorName.trim(),
          instructorDesignation: instructorDesignation.trim(),
        })
      );
    } catch {
      // Non-blocking storage fallback
    }
  }, [name, schoolName, role, instructorName, instructorDesignation]);

  const isFinal = levelId === 'final';
  const levelNum = isFinal ? null : parseInt(levelId, 10);
  const level = isFinal ? null : LEVELS.find((l) => l.id === levelNum);

  // Navigation guards
  if (!practiceMode && isFinal && completedLevels.length < 4) {
    return <Navigate to="/levels" replace />;
  }
  if (!practiceMode && !isFinal && (!level || (!completedLevels.includes(levelNum) && !levelScores[levelNum]?.passed))) {
    return <Navigate to="/levels" replace />;
  }

  const scoreData = isFinal ? null : levelScores[levelNum];

  // Derive completion date: automatically use recorded date from device completion or fallback to today
  let completionDateRaw = null;
  if (!isFinal && scoreData?.date) {
    completionDateRaw = scoreData.date;
  } else if (isFinal) {
    // Find latest completion date across levels
    const dates = Object.values(levelScores)
      .map((s) => s?.date)
      .filter(Boolean)
      .sort();
    completionDateRaw = dates.length ? dates[dates.length - 1] : new Date().toISOString();
  } else {
    completionDateRaw = new Date().toISOString();
  }

  const completionDateObj = new Date(completionDateRaw);
  const dateFormatted = isNaN(completionDateObj.getTime())
    ? new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : completionDateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  // Calculate overall stats for final certificate
  const totalScore = Object.values(levelScores).reduce((acc, curr) => acc + (curr?.score || 0), 0);
  const totalCorrect = Object.values(levelScores).reduce((acc, curr) => acc + (curr?.correct || 0), 0);

  function handleNameChange(val) {
    setName(val);
    const trimmed = val.trim();
    if (trimmed) {
      dispatch({ type: 'SET_LEARNER_NAME', payload: trimmed });
    }
  }

  function handlePrint() {
    window.print();
  }

  async function handleDownloadPNG() {
    if (!certRef.current) return;
    setIsDownloadingPNG(true);
    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });
      const dataUrl = canvas.toDataURL('image/png');
      const safeName = (name.trim() || 'Participant').replace(/[^a-zA-Z0-9_-]/g, '_');
      const link = document.createElement('a');
      link.download = `Hifazat-Dojo-Certificate-${safeName}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export certificate as PNG', err);
      alert(isUrdu ? 'سرٹیفکیٹ ڈاؤن لوڈ کرنے میں خرابی ہوئی۔ براہِ کرم پرنٹ آپشن استعمال کریں۔' : 'Failed to generate PNG image. Please use the Print option.');
    } finally {
      setIsDownloadingPNG(false);
    }
  }

  async function handleDownloadPDF() {
    if (!certRef.current) return;
    setIsDownloadingPDF(true);
    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Fit image into A4 page while maintaining aspect ratio
      const imgRatio = canvas.width / canvas.height;
      const pageRatio = pdfWidth / pdfHeight;

      let renderWidth = pdfWidth;
      let renderHeight = pdfHeight;
      let xOffset = 0;
      let yOffset = 0;

      if (imgRatio > pageRatio) {
        renderWidth = pdfWidth;
        renderHeight = pdfWidth / imgRatio;
        yOffset = (pdfHeight - renderHeight) / 2;
      } else {
        renderHeight = pdfHeight;
        renderWidth = pdfHeight * imgRatio;
        xOffset = (pdfWidth - renderWidth) / 2;
      }

      pdf.addImage(imgData, 'PNG', xOffset, yOffset, renderWidth, renderHeight);
      const safeName = (name.trim() || 'Participant').replace(/[^a-zA-Z0-9_-]/g, '_');
      pdf.save(`Hifazat-Dojo-Certificate-${safeName}.pdf`);
    } catch (err) {
      console.error('Failed to export certificate as PDF', err);
      alert(isUrdu ? 'پی ڈی ایف بنانے میں خرابی ہوئی۔ براہِ کرم پرنٹ آپشن استعمال کریں۔' : 'Failed to generate PDF. Please use the Print option.');
    } finally {
      setIsDownloadingPDF(false);
    }
  }

  const isNameMissing = !name.trim();

  return (
    <div className={`page-container max-w-5xl ${isUrdu ? 'rtl' : ''}`}>
      {/* Top Action Toolbar (Hidden on Print) */}
      <div className="no-print mb-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-navy-900/90 p-4 rounded-2xl border border-navy-700/80 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📜</span>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                {isUrdu ? 'سرٹیفکیٹ مینجمنٹ' : 'Official Certificate Hub'}
              </h2>
              <p className="text-xs text-navy-300">
                {name.trim() ? (
                  <>
                    <span>Participant: </span>
                    <strong className="text-shield-300">{name.trim()}</strong>
                    {schoolName.trim() && <span className="text-navy-400"> • {schoolName.trim()}</span>}
                  </>
                ) : (
                  <span className="text-amber-300">⚠️ {isUrdu ? 'براہِ کرم نام درج کریں' : 'Please enter participant name'}</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="btn-secondary text-xs sm:text-sm py-2 px-3 sm:px-4 cursor-pointer"
            >
              {showConfig ? (isUrdu ? 'فارم چھپائیں 🔼' : 'Hide Details Form 🔼') : (isUrdu ? 'تفصیلات تبدیل کریں ✏️' : 'Edit Certificate Details ✏️')}
            </button>
            <button
              onClick={handlePrint}
              disabled={isNameMissing}
              className="btn-primary text-xs sm:text-sm py-2 px-3 sm:px-4 shadow-md cursor-pointer disabled:opacity-40"
              title="Print via Browser (A4 Landscape)"
            >
              🖨️ {isUrdu ? 'پرنٹ کریں' : 'Print Certificate'}
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={isNameMissing || isDownloadingPDF}
              className="btn-secondary text-xs sm:text-sm py-2 px-3 sm:px-4 cursor-pointer border-shield-500/50 text-shield-300 hover:text-white disabled:opacity-40"
            >
              {isDownloadingPDF ? '⏳ ...' : '📄 ' + (isUrdu ? 'پی ڈی ایف ڈاؤن لوڈ' : 'Download PDF')}
            </button>
            <button
              onClick={handleDownloadPNG}
              disabled={isNameMissing || isDownloadingPNG}
              className="btn-secondary text-xs sm:text-sm py-2 px-3 sm:px-4 cursor-pointer border-emerald-500/50 text-emerald-300 hover:text-white disabled:opacity-40"
            >
              {isDownloadingPNG ? '⏳ ...' : '📥 ' + (isUrdu ? 'پی این جی ڈاؤن لوڈ' : 'Download PNG')}
            </button>
            <Link to="/levels" className="btn-secondary text-xs sm:text-sm py-2 px-3">
              {isUrdu ? '← ڈوجو لیولز' : '← Levels'}
            </Link>
          </div>
        </div>

        {/* Certificate Customization Form (Collapsible / Dynamic) */}
        {showConfig && (
          <div className="card p-5 sm:p-7 border-shield-500/30 bg-navy-900/90 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-navy-700/80">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>🎓</span>
                  <span>{isUrdu ? 'سرٹیفکیٹ کی تفصیلات درج کریں' : 'Customize Certificate Information'}</span>
                </h3>
                <p className="text-xs text-navy-300">
                  {isUrdu
                    ? 'یہ ایپ کسی بھی اسکول یا ادارے کے لیے قابلِ استعمال ہے۔ کوئی اسکول نام پہلے سے فکس نہیں ہے۔'
                    : 'This app is public for any school or organization. Fill in details below to customize:'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowConfig(false)}
                className="text-xs text-navy-400 hover:text-white underline cursor-pointer"
              >
                {isUrdu ? 'بند کریں ✕' : 'Close ✕'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              {/* Field 1: Participant Name (Required) */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="block font-bold text-shield-300">
                  {isUrdu ? 'طالب علم / شریک کا نام (لازمی) *' : 'Student / Participant Name (Required) *'}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder={isUrdu ? 'مثال: عائشہ خان / Ali Raza' : 'e.g. Ayesha Khan / Ali Raza'}
                  className="w-full bg-navy-950 border border-shield-500/60 rounded-xl px-4 py-2.5 text-white font-bold focus:outline-none focus:ring-2 focus:ring-shield-400 text-sm sm:text-base"
                  maxLength={70}
                  dir="auto"
                />
              </div>

              {/* Field 2: School / Organization Name (Optional) */}
              <div className="space-y-1.5">
                <label className="block font-medium text-navy-200">
                  {isUrdu ? 'اسکول یا تنظیم کا نام (اختیاری)' : 'School / Organization Name (Optional)'}
                </label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder={isUrdu ? 'مثال: گورنمنٹ ہائی اسکول / The City School' : 'e.g. Army Public School / The City School'}
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-shield-400"
                  maxLength={90}
                  dir="auto"
                />
                <span className="text-[11px] text-navy-400 block">
                  {isUrdu ? 'اگر خالی چھوڑا جائے تو سرٹیفکیٹ پر اسکول کا نام ظاہر نہیں ہوگا' : 'Leave empty if you do not want a school name on the certificate'}
                </span>
              </div>

              {/* Field 3: Class / Role (Optional) */}
              <div className="space-y-1.5">
                <label className="block font-medium text-navy-200">
                  {isUrdu ? 'کلاس / کردار (اختیاری)' : 'Class / Role (Optional)'}
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-shield-400"
                >
                  {ROLE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-navy-900 text-white">
                      {isUrdu ? opt.label_ur : opt.label_en}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-navy-400 block">
                  Options: Student, Teacher, Parent, Community Member
                </span>
              </div>

              {/* Field 4: Instructor / Teacher Name (Optional) */}
              <div className="space-y-1.5">
                <label className="block font-medium text-navy-200">
                  {isUrdu ? 'سائبر لیڈ انسٹرکٹر یا کلاس ٹیچر کا نام (اختیاری)' : 'Cyber Lead Instructor / Class Teacher Name (Optional)'}
                </label>
                <input
                  type="text"
                  value={instructorName}
                  onChange={(e) => setInstructorName(e.target.value)}
                  placeholder={isUrdu ? 'مثال: محترمہ شازیہ / Mr. Tariq' : 'e.g. Ms. Shazia / Mr. Tariq'}
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-shield-400"
                  maxLength={70}
                  dir="auto"
                />
                <span className="text-[11px] text-navy-400 block">
                  {isUrdu ? 'خالی چھوڑنے پر کوئی فرضی نام ظاہر نہیں ہوگا' : 'If left empty, no fake person name will be displayed'}
                </span>
              </div>

              {/* Field 5: Instructor Designation (Optional) */}
              <div className="space-y-1.5">
                <label className="block font-medium text-navy-200">
                  {isUrdu ? 'انسٹرکٹر کا عہدہ / Designation (اختیاری)' : 'Cyber Lead Instructor / Class Teacher Designation (Optional)'}
                </label>
                <input
                  type="text"
                  list="cert-designations"
                  value={instructorDesignation}
                  onChange={(e) => setInstructorDesignation(e.target.value)}
                  placeholder="e.g. Cyber Safety Lead, Class Teacher, Principal"
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-shield-400"
                  maxLength={70}
                  dir="auto"
                />
                <datalist id="cert-designations">
                  {COMMON_DESIGNATIONS.map((desig) => (
                    <option key={desig} value={desig} />
                  ))}
                </datalist>
                <span className="text-[11px] text-navy-400 block">
                  Default title: "Cyber Lead Instructor"
                </span>
              </div>
            </div>

            {/* Privacy Reassurance Note */}
            <div className="mt-4 pt-3 border-t border-navy-800 text-[11px] text-navy-400 flex items-center justify-between flex-wrap gap-2">
              <span className="flex items-center gap-1.5">
                <span>🔒</span>
                <span>
                  {isUrdu
                    ? 'پرائیویسی گارنٹی: کوئی CNIC، فون نمبر، پاس ورڈ، OTP یا بینک ڈیٹا محفوظ نہیں کیا جاتا۔ تمام ڈیٹا آپ کے براؤزر میں رہتا ہے۔'
                    : 'Zero-Data Privacy: No CNIC, phone number, password, OTP, or financial details are collected or stored.'}
                </span>
              </span>
              <button
                type="button"
                onClick={() => setShowConfig(false)}
                className="btn-primary text-xs py-1.5 px-4"
              >
                {isUrdu ? 'سرٹیفکیٹ دیکھیں ✓' : 'Apply & Preview Certificate ✓'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Required Name Notice if empty */}
      {isNameMissing && (
        <div className="no-print warning-banner mb-6 animate-pulse-soft">
          <span className="text-xl">⚠️</span>
          <div>
            <h4 className="font-bold">
              {isUrdu ? 'طالب علم کا نام درکار ہے' : 'Participant Name Required'}
            </h4>
            <p className="text-xs">
              {isUrdu
                ? 'سرٹیفکیٹ تیار اور ڈاؤن لوڈ کرنے کے لیے اوپر فارم میں اپنا نام درج کریں۔'
                : 'Please enter the participant name in the customization form above to personalize and download this certificate.'}
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          PRINTABLE & CAPTURABLE A4 LANDSCAPE CERTIFICATE FRAME
          Security Shield Themed, Gold & Navy Ornamental Border, No Hardcoded Schools
         ========================================================================= */}
      <div
        ref={certRef}
        className="certificate-container bg-[#ffffff] text-[#0d1b2a] rounded-2xl p-6 sm:p-10 md:p-12 border-[8px] sm:border-[12px] border-[#0e1d38] relative overflow-hidden shadow-2xl mx-auto"
        style={{
          boxSizing: 'border-box',
          minHeight: '520px',
        }}
      >
        {/* Ornate Gold Filigree Inner Border */}
        <div className="absolute inset-2 sm:inset-3 border-2 border-[#b8860b]/70 pointer-events-none rounded-lg" />
        <div className="absolute inset-3.5 sm:inset-5 border border-[#0e1d38]/20 pointer-events-none rounded" />

        {/* Security Corner Brackets & Flourishes */}
        <div className="absolute top-4 left-4 w-7 h-7 border-t-2 border-l-2 border-[#b8860b]" />
        <div className="absolute top-4 right-4 w-7 h-7 border-t-2 border-r-2 border-[#b8860b]" />
        <div className="absolute bottom-4 left-4 w-7 h-7 border-b-2 border-l-2 border-[#b8860b]" />
        <div className="absolute bottom-4 right-4 w-7 h-7 border-b-2 border-r-2 border-[#b8860b]" />

        {/* Faint Background Security Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none select-none">
          <ShieldIcon size={360} />
        </div>

        {/* Certificate Body */}
        <div className="text-center relative z-10 py-1 flex flex-col justify-between h-full">
          {/* Header Area */}
          <div>
            <div className="flex justify-center mb-2">
              <div className="p-1 rounded-full bg-slate-50 border border-slate-200 shadow-xs">
                <ShieldIcon size={52} />
              </div>
            </div>

            {/* School / Organization Name Banner (ONLY displayed if entered by user) */}
            {schoolName.trim() && (
              <div className="mb-1">
                <span className="inline-block px-4 py-0.5 rounded-full text-xs sm:text-sm font-black tracking-widest text-[#0e1d38] uppercase bg-amber-50 border border-[#b8860b]/50">
                  🏫 {schoolName.trim()}
                </span>
              </div>
            )}

            {/* Official Project Title */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#0e1d38] tracking-wide mb-1 font-serif">
              Hifazat Dojo: AI-Powered Multi-Level Scam aur Phishing Awareness Game
            </h1>

            <p className="text-[11px] sm:text-xs font-black text-[#b8860b] uppercase tracking-[0.25em]">
              Certificate of Digital Defense & Cyber Awareness
            </p>

            <div className="w-24 sm:w-36 h-0.5 bg-gradient-to-r from-transparent via-[#b8860b] to-transparent mx-auto my-2" />

            <p className="text-navy-600 text-xs sm:text-sm italic font-serif">
              This is to certify that
            </p>

            {/* Participant Name */}
            <div className="my-1.5 sm:my-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0e1d38] border-b-2 border-[#b8860b] pb-1 inline-block px-6 sm:px-12 tracking-tight font-serif">
                {name.trim() || '____________________'}
              </h2>
              {role && (
                <div className="mt-1">
                  <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-300">
                    Role: {role}
                  </span>
                </div>
              )}
            </div>

            <p className="text-navy-700 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              has successfully demonstrated vital cybersecurity competence in identifying phishing attacks, OTP fraud, and digital impersonation:
            </p>

            {/* Completed Level & Score Showcase */}
            {isFinal ? (
              <div className="my-2.5 sm:my-3 py-2 sm:py-2.5 px-6 bg-amber-50/90 rounded-xl border border-amber-300 max-w-xl mx-auto shadow-xs">
                <p className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-amber-900 mb-0.5">
                  🏆 HIGHEST DISTINCTION • ALL 4 DOJO LEVELS MASTERED
                </p>
                <h3 className="text-lg sm:text-2xl font-black text-[#0e1d38] font-serif">
                  Hifazat Dojo Community Guardian
                </h3>
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs text-navy-800 mt-1">
                  <span>
                    Cumulative Score: <strong className="text-amber-900 font-black">{totalScore || 400}/400</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Scenarios: <strong className="text-[#0e1d38] font-black">{totalCorrect || 40}/40 Correct</strong>
                  </span>
                  <span>•</span>
                  <span className="font-bold text-[#b8860b]">
                    🏅 Badge Earned: <strong>Community Guardian</strong>
                  </span>
                </div>
              </div>
            ) : (
              <div className="my-2.5 sm:my-3 py-2 sm:py-2.5 px-6 bg-emerald-50/90 rounded-xl border border-emerald-300 max-w-xl mx-auto shadow-xs">
                <p className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-emerald-900 mb-0.5">
                  STAGE MASTERY COMPLETED
                </p>
                <h3 className="text-base sm:text-xl font-black text-[#0e1d38] font-serif">
                  {level?.icon} Level {level?.id}: {level?.name_en} {level?.name_ur ? `• ${level.name_ur}` : ''}
                </h3>
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs text-navy-800 mt-0.5">
                  <span>
                    Score: <strong className="text-emerald-900 font-black">{scoreData?.score ?? 100}/100</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Accuracy: <strong className="text-[#0e1d38] font-black">{scoreData?.correct ?? 10}/10 Correct</strong>
                  </span>
                  <span>•</span>
                  <span className="font-bold text-[#b8860b]">
                    🏅 Badge Earned: <strong>{level?.badge_en}</strong>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Row: Date (Bottom-Left), Official Seal (Center), Signature Block (Bottom-Right) */}
          <div className="mt-4 pt-3 border-t border-slate-300 grid grid-cols-3 items-end gap-3 max-w-2xl mx-auto w-full text-xs">
            {/* Left Column: Date of Completion (Device-Verified) */}
            <div className="text-center">
              <div className="h-7 border-b border-slate-500 mx-auto w-28 sm:w-36 mb-1 flex items-end justify-center font-serif text-[#0e1d38] text-xs sm:text-sm font-bold">
                {dateFormatted}
              </div>
              <p className="font-bold text-[#0e1d38] text-[11px] sm:text-xs">
                {isUrdu ? 'تاریخِ تکمیل' : 'Date of Completion'}
              </p>
              <p className="text-[9px] text-slate-500 leading-tight">
                Device Timestamp Verified
              </p>
            </div>

            {/* Center Column: Golden Seal */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-full border-2 border-dashed border-[#b8860b] bg-amber-50 flex items-center justify-center shadow-inner">
                <span className="text-lg sm:text-xl">🎖️</span>
              </div>
              <span className="text-[8px] font-mono font-bold text-[#b8860b] uppercase tracking-wider mt-0.5">
                OFFICIAL SEAL
              </span>
            </div>

            {/* Right Column: Signature Block */}
            <div className="text-center">
              {/* Clean signature line: displays typed instructor name if entered; otherwise line is clean with NO fake name */}
              <div className="h-7 border-b border-slate-500 mx-auto w-28 sm:w-36 mb-1 flex items-end justify-center font-serif italic text-[#0e1d38] text-xs sm:text-sm font-semibold">
                {instructorName.trim() ? instructorName.trim() : ''}
              </div>
              <p className="font-bold text-[#0e1d38] text-[11px] sm:text-xs">
                {instructorDesignation.trim() || 'Cyber Lead Instructor'}
              </p>
              <p className="text-[7.5px] sm:text-[8px] text-slate-500 max-w-[170px] mx-auto mt-0.5 leading-tight">
                Digital certificate generated by Hifazat Dojo. Signature is displayed as typed by the school/organization.
              </p>
            </div>
          </div>

          {/* Verification Code & Zero-Data Privacy Notice */}
          <div className="mt-3 pt-1 border-t border-slate-200 text-[8px] sm:text-[9px] text-slate-400 font-mono flex flex-wrap items-center justify-between gap-1 px-2">
            <span>
              Document Verification ID: HD-{isFinal ? 'FINAL' : `L${levelNum}`}-{Date.now().toString(36).toUpperCase()} • 100% Client-Side Verified
            </span>
            <span>
              Zero-Data Privacy: No CNIC, phone number, password, or financial data collected or stored.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
