import React from 'react';

// Fictional phone numbers & domain constants adhering to strict safety rules
const DEMO_PHONE = '+92-3XX-XXXXXXX';
const DEMO_LINK = 'http://example-phishing-site.test/claim-prize';
const DEMO_BANK_LINK = 'http://example-phishing-site.test/bank-update';

// Scenario type mapper based on question ID or content cues
export function getScenarioType(question) {
  if (!question) return 'sms';
  const qId = question.id || '';
  const text = (question.scenario || '').toLowerCase();
  const title = (question.title_en || '').toLowerCase();

  // Explicit ID mappings for precision
  const typeMap = {
    L1Q01: 'sms',
    L1Q02: 'whatsapp',
    L1Q03: 'safe_notice',
    L1Q04: 'sms',
    L1Q05: 'bank_otp',
    L1Q06: 'safe_notice',
    L1Q07: 'sms',
    L1Q08: 'whatsapp',
    L1Q09: 'safe_notice',
    L1Q10: 'sms',
    L2Q01: 'email',
    L2Q02: 'call',
    L2Q03: 'whatsapp',
    L2Q04: 'whatsapp',
    L2Q05: 'safe_notice',
    L2Q06: 'bank_otp',
    L2Q07: 'email',
    L2Q08: 'safe_notice',
    L2Q09: 'sms',
    L2Q10: 'safe_notice',
    L3Q01: 'whatsapp',
    L3Q02: 'whatsapp',
    L3Q03: 'qr',
    L3Q04: 'email',
    L3Q05: 'qr_safe',
    L3Q06: 'whatsapp',
    L3Q07: 'whatsapp',
    L3Q08: 'safe_notice',
    L3Q09: 'whatsapp',
    L3Q10: 'safe_notice',
    L4Q01: 'call',
    L4Q02: 'call',
    L4Q03: 'call',
    L4Q04: 'whatsapp',
    L4Q05: 'call',
    L4Q06: 'safe_notice',
    L4Q07: 'call',
    L4Q08: 'bank_otp',
    L4Q09: 'safe_notice',
    L4Q10: 'safe_notice',
  };

  if (typeMap[qId]) return typeMap[qId];

  // Dynamic content fallback
  if (question.correct_answer === 'Safe') return 'safe_notice';
  if (text.includes('qr') || text.includes('scan') || title.includes('qr')) return 'qr';
  if (text.includes('bank') || text.includes('otp') || text.includes('wallet') || text.includes('pin') || text.includes('refund')) return 'bank_otp';
  if (text.includes('call') || text.includes('caller') || text.includes('voice') || text.includes('phone')) return 'call';
  if (text.includes('email') || text.includes('mail') || text.includes('subject')) return 'email';
  if (text.includes('whatsapp') || text.includes('chat') || text.includes('group')) return 'whatsapp';

  return 'sms';
}

const REALISTIC_WORDINGS = {
  L1Q01: {
    en: "Congratulations! You have been selected for a free mobile prize in the Mega Lucky Draw. Claim within 2 hours by clicking this link: http://example-phishing-site.test/claim-prize or reply with your password.",
    ur: "مبارک ہو! Congratulations, آپ نے مفت موبائل پرائز جیتا ہے۔ ۲ گھنٹے کے اندر حاصل کرنے کے لیے اس لنک پر کلک کریں یا پاس ورڈ ریپلائی کریں: http://example-phishing-site.test/claim-prize",
  },
  L1Q04: {
    en: "Urgent Security Notice: Your student account requires immediate verification. Reply with your secret password immediately to avoid account suspension.",
    ur: "فوری سکیورٹی نوٹس: آپ کے اکاؤنٹ کی تصدیق درکار ہے۔ اکاؤنٹ بند ہونے سے بچانے کے لیے اپنا پاس ورڈ ابھی ریپلائی میں بھیجیں۔",
  },
  L1Q07: {
    en: "Security Alert: Your account will be blocked today! Update your password immediately using this link: http://example-phishing-site.test/account-security",
    ur: "سکیورٹی الرٹ: Your account will be blocked today! اکاؤنٹ بندش سے بچانے کے لیے اپنا پاس ورڈ فوری طور پر اس لنک کے ذریعے اپ ڈیٹ کریں: http://example-phishing-site.test/account-security",
  },
  L2Q09: {
    en: "Your parcel is pending at our courier hub. Pay a small delivery fee of Rs. 120 using this link to receive it today: http://example-phishing-site.test/parcel-pending",
    ur: "Your parcel is pending! آپ کا پارسل ڈیپو پر رکا ہوا ہے۔ ڈیلیوری فیس (120 روپے) اس لنک پر فوری ادا کریں تاکہ پارسل موصول ہو: http://example-phishing-site.test/parcel-pending",
  },
  L4Q02: {
    en: "This is your Demo Bank security team. Share the verification code sent to your phone right now to stop unauthorized access and protect your card.",
    ur: "ہم ڈیمو بینک سکیورٹی ٹیم سے بات کر رہے ہیں۔ کارڈ کو غیر قانونی استعمال سے بچانے کے لیے اپنے موبائل پر آیا ہوا ون ٹائم تصدیقی کوڈ (OTP) ابھی بتائیں۔",
  },
};

// Clean helper to extract message body from raw scenario
function getDisplayMessage(scenario, questionId, isUrdu) {
  if (questionId && REALISTIC_WORDINGS[questionId]) {
    return isUrdu ? REALISTIC_WORDINGS[questionId].ur : REALISTIC_WORDINGS[questionId].en;
  }
  if (!scenario) return '';
  // Remove "Fictional SMS: ", "Fictional message: ", quotes, etc. for realistic simulation
  let clean = scenario
    .replace(/^Fictional (SMS|WhatsApp message from an unknown person|WhatsApp message|message|caller says|email says|pop-up|online quiz|DM|social post|group message|seller says|buyer says):\s*/i, '')
    .trim();

  // Strip wrapping single or double quotes
  if ((clean.startsWith("'") && clean.endsWith("'")) || (clean.startsWith('"') && clean.endsWith('"'))) {
    clean = clean.slice(1, -1);
  }
  return clean;
}

export default function ScenarioCard({ question, language = 'en' }) {
  const isUrdu = language === 'ur';
  const type = getScenarioType(question);
  const messageBody = getDisplayMessage(question.scenario, question.id, isUrdu);

  // Safety training badge component
  const TrainingBadge = ({ isSafe = false }) => (
    <div className="flex items-center justify-between px-3 py-1.5 bg-navy-950/90 border-b border-navy-800 text-[11px] select-none">
      <span className="flex items-center gap-1.5 font-bold font-mono">
        <span className={`w-2 h-2 rounded-full ${isSafe ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
        <span className={isSafe ? 'text-emerald-300' : 'text-amber-300'}>
          {isSafe
            ? (isUrdu ? '✅ تربیتی مثال — اسکول سیفٹی پریکٹس' : '✅ Educational Practice — Safe Scenario')
            : (isUrdu ? '⚠️ تربیتی مثال — یہ اصلی پیغام نہیں ہے' : '⚠️ Training Example — Not a Real Message')}
        </span>
      </span>
      <span className="text-[10px] text-navy-400 font-mono hidden xs:inline">
        Hifazat Dojo Lab
      </span>
    </div>
  );

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-navy-700/80 bg-navy-950 transition-all duration-300">
      <TrainingBadge isSafe={type === 'safe_notice' || type === 'qr_safe'} />

      {/* =========================================================================
          1. SMS CARD LAYOUT (Mobile-style text bubble, Unknown Number, Fictional Phone)
         ========================================================================= */}
      {type === 'sms' && (
        <div className="p-4 sm:p-5 bg-gradient-to-b from-[#141e30] to-[#0f172a] text-left">
          {/* Mobile Status Bar Simulation */}
          <div className="flex items-center justify-between text-[11px] text-navy-400 pb-2 mb-3 border-b border-navy-800/80">
            <span className="font-mono">10:48 AM</span>
            <div className="flex items-center gap-2">
              <span>📶 4G</span>
              <span>🔋 85%</span>
            </div>
          </div>

          {/* Sender Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-navy-800 border border-navy-600 flex items-center justify-center text-lg text-navy-200 shadow-inner">
                👤
              </div>
              <div>
                <p className="text-white text-sm font-bold flex items-center gap-1.5">
                  <span>Unknown Number</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-950/80 text-rose-300 border border-rose-800">Unverified</span>
                </p>
                <p className="text-navy-400 text-xs font-mono">{DEMO_PHONE}</p>
              </div>
            </div>
            <span className="text-[10px] text-navy-400">SMS Cellular</span>
          </div>

          {/* SMS Speech Bubble */}
          <div className="relative bg-[#1e293b] text-white p-4 rounded-2xl rounded-tl-sm border border-navy-600/70 shadow-lg max-w-[92%] leading-relaxed">
            <div className="text-sm sm:text-base mb-2 font-medium">
              {messageBody}
            </div>

            {/* Fictional link preview if scenario mentions link */}
            {(messageBody.toLowerCase().includes('link') || question.scenario.toLowerCase().includes('link')) && (
              <div className="my-2 p-2 rounded-lg bg-navy-950/80 border border-amber-500/40 text-xs text-amber-200 flex items-center gap-2 font-mono">
                <span>🔗</span>
                <span className="truncate underline">{DEMO_LINK}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-[10px] text-navy-400 mt-2 pt-1 border-t border-navy-700/50">
              <span>Delivered</span>
              <span>Today 10:48 AM</span>
            </div>
          </div>

          <p className="text-[10px] text-navy-400 mt-3 text-center italic">
            {isUrdu ? '⚠️ یہ ایک فرضی ایس ایم ایس ہے۔ کبھی بھی پاس ورڈ یا او ٹی پی میسج میں نہ بھیجیں۔' : '⚠️ Fictional cellular SMS. Never reply with passwords, OTPs, or financial secrets.'}
          </p>
        </div>
      )}

      {/* =========================================================================
          2. WHATSAPP-STYLE CARD (Generic chat bubble, Forwarded tag, NO real logos)
         ========================================================================= */}
      {type === 'whatsapp' && (
        <div className="p-4 sm:p-5 bg-[#0b141a] text-left">
          {/* Chat Header */}
          <div className="bg-[#1f2c34] p-3 rounded-xl flex items-center justify-between mb-4 border border-[#2a3942] shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#374248] border border-emerald-600/50 flex items-center justify-center text-lg text-white shrink-0">
                👤
              </div>
              <div className="truncate">
                <p className="text-white text-sm font-bold truncate">Unknown Contact</p>
                <p className="text-[#8696a0] text-xs font-mono">{DEMO_PHONE} • Online</p>
              </div>
            </div>
            <div className="text-right text-[10px] text-emerald-400 font-mono shrink-0">
              🔒 Chat Simulation
            </div>
          </div>

          {/* Chat Message Bubble */}
          <div className="max-w-[92%] bg-[#1f2c34] border border-[#2a3942] rounded-2xl rounded-tl-sm p-3.5 sm:p-4 text-white shadow-md">
            {/* Forwarded Many Times Tag */}
            <div className="flex items-center gap-1.5 text-[11px] text-[#8696a0] italic mb-1.5 pb-1 border-b border-[#2a3942]/60">
              <span>⤹</span>
              <span>Forwarded many times</span>
            </div>

            <div className="text-sm sm:text-base leading-relaxed font-normal text-slate-100 mb-2">
              {messageBody}
            </div>

            {/* Fictional link preview if scenario mentions link */}
            {(messageBody.toLowerCase().includes('link') || question.scenario.toLowerCase().includes('link')) && (
              <div className="my-2 p-2 rounded-lg bg-[#111b21] border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2 font-mono">
                <span>🌐</span>
                <span className="truncate">{DEMO_LINK}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-1.5 text-[10px] text-[#8696a0] mt-1">
              <span>11:24 AM</span>
              <span className="text-emerald-400">✓✓</span>
            </div>
          </div>

          <p className="text-[10px] text-navy-400 mt-3 text-center italic">
            {isUrdu ? 'فارورڈ شدہ پیغامات اور نامعلوم لنکس اکثر دھوکہ دہی کے لیے استعمال ہوتے ہیں۔' : 'Forwarded messages from unknown contacts with lucrative claims are major fraud indicators.'}
          </p>
        </div>
      )}

      {/* =========================================================================
          3. EMAIL / PHISHING CARD (Webmail client, sender, subject, fake link)
         ========================================================================= */}
      {type === 'email' && (
        <div className="p-4 sm:p-5 bg-[#0f172a] text-left">
          {/* Webmail App Header */}
          <div className="bg-[#1e293b] p-3 rounded-xl border border-navy-700 flex items-center justify-between text-xs text-navy-300 mb-3">
            <span className="font-bold text-white flex items-center gap-2">
              <span>✉️</span> Webmail Client Simulation
            </span>
            <span className="bg-rose-950 border border-rose-600/50 text-rose-300 px-2 py-0.5 rounded text-[10px] font-bold">
              ⚠️ External Sender
            </span>
          </div>

          {/* Email Headers */}
          <div className="p-3 bg-navy-900/90 rounded-xl border border-navy-800 text-xs space-y-1.5 mb-3 font-mono">
            <p>
              <span className="text-navy-400">From: </span>
              <strong className="text-white">Security Alerts Desk &lt;verify-desk@service-notice.test&gt;</strong>
            </p>
            <p>
              <span className="text-navy-400">Subject: </span>
              <strong className="text-amber-300">{question.title_en || 'Urgent Security Notification'}</strong>
            </p>
            <p>
              <span className="text-navy-400">To: </span>
              <span className="text-navy-300">student@school.test</span>
            </p>
          </div>

          {/* Email Body */}
          <div className="bg-[#1e293b]/90 p-4 rounded-xl border border-navy-700 text-slate-100 text-sm sm:text-base leading-relaxed">
            <p className="mb-3 font-medium">{messageBody}</p>

            {/* Fictional phishing link button */}
            <div className="my-3 p-3 rounded-xl bg-navy-950 border border-amber-500/50 text-xs">
              <span className="text-amber-400 font-bold block mb-1">🔗 Fictional Suspicious Link:</span>
              <code className="text-shield-300 font-mono text-[11px] block break-all">
                {DEMO_LINK}
              </code>
            </div>

            <p className="text-[11px] text-navy-400 italic">
              Notice: Legitimate platforms never ask for credentials via unsolicited email links.
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          4. VOICE CALL CARD (Incoming Call Screen, Unknown Caller, duration, transcript)
         ========================================================================= */}
      {type === 'call' && (
        <div className="p-5 sm:p-6 bg-gradient-to-b from-[#0b1329] via-[#091124] to-[#040814] text-center">
          {/* Simulated Network Indicator */}
          <div className="text-[11px] font-mono text-navy-400 mb-4 flex justify-between items-center">
            <span>SIM 1 • VoLTE</span>
            <span className="text-amber-400 animate-pulse">● Call Connected (00:48)</span>
          </div>

          {/* Pulsing Avatar Icon */}
          <div className="relative w-20 h-20 mx-auto mb-3">
            <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping" />
            <div className="w-20 h-20 rounded-full bg-navy-800 border-2 border-amber-400/80 flex items-center justify-center text-4xl shadow-xl relative z-10">
              📞
            </div>
          </div>

          <h3 className="text-xl font-black text-white mb-0.5">Unknown Caller</h3>
          <p className="text-navy-400 text-xs font-mono mb-4">{DEMO_PHONE}</p>

          {/* Audio Waveform Simulator */}
          <div className="flex items-center justify-center gap-1.5 h-6 mb-4">
            <div className="w-1 bg-amber-400 h-3 animate-pulse" />
            <div className="w-1 bg-amber-400 h-5 animate-pulse" style={{ animationDelay: '100ms' }} />
            <div className="w-1 bg-amber-400 h-2 animate-pulse" style={{ animationDelay: '200ms' }} />
            <div className="w-1 bg-amber-400 h-6 animate-pulse" style={{ animationDelay: '300ms' }} />
            <div className="w-1 bg-amber-400 h-4 animate-pulse" style={{ animationDelay: '150ms' }} />
            <div className="w-1 bg-amber-400 h-5 animate-pulse" style={{ animationDelay: '250ms' }} />
            <div className="w-1 bg-amber-400 h-3 animate-pulse" style={{ animationDelay: '350ms' }} />
          </div>

          {/* Transcript Box */}
          <div className="bg-navy-950/90 p-4 rounded-xl border border-navy-800 text-left mb-4 shadow-inner">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block mb-1">
              🎙️ Caller Audio Transcript:
            </span>
            <p className="text-white text-sm sm:text-base font-medium leading-relaxed italic">
              "{messageBody}"
            </p>
          </div>

          {/* Call Controls Simulator */}
          <div className="flex justify-center gap-10 text-xs font-bold text-navy-400 pt-2">
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-12 h-12 rounded-full bg-rose-600/90 text-white flex items-center justify-center text-xl shadow-lg shadow-rose-600/30">
                ✕
              </div>
              <span>End Call</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-12 h-12 rounded-full bg-navy-800 text-white border border-navy-700 flex items-center justify-center text-xl">
                🔇
              </div>
              <span>Mute</span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          5. QR CODE CARD (Fictional vector QR, Scan warning, not scannable)
         ========================================================================= */}
      {(type === 'qr' || type === 'qr_safe') && (
        <div className="p-5 sm:p-6 bg-[#0a1128] text-center">
          {/* Prominent Scan Warning */}
          <div className="mb-4 p-2.5 rounded-xl bg-amber-950/80 border border-amber-500/60 text-amber-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-2">
            <span className="text-base">⚠️</span>
            <span>{isUrdu ? 'اسکین کرنے سے پہلے لنک ویریفائی کریں (Scan karne se pehle link verify karein)' : 'Scan karne se pehle link verify karein (Verify link before scanning)'}</span>
          </div>

          {/* Fictional & Stylized Non-Scannable QR Viewfinder */}
          <div className="w-40 h-40 mx-auto my-3 relative p-4 bg-white rounded-2xl flex items-center justify-center shadow-xl border-4 border-cyan-400/80">
            {/* Corner Tactical Reticles */}
            <div className="absolute top-1 left-1 w-4 h-4 border-t-4 border-l-4 border-cyan-500" />
            <div className="absolute top-1 right-1 w-4 h-4 border-t-4 border-r-4 border-cyan-500" />
            <div className="absolute bottom-1 left-1 w-4 h-4 border-b-4 border-l-4 border-cyan-500" />
            <div className="absolute bottom-1 right-1 w-4 h-4 border-b-4 border-r-4 border-cyan-500" />

            {/* Stylized Simulated QR Matrix (Geometric grid, completely non-scannable) */}
            <svg viewBox="0 0 100 100" className="w-full h-full text-navy-950" fill="currentColor">
              {/* Top-Left Finder */}
              <rect x="5" y="5" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="5" />
              <rect x="12" y="12" width="11" height="11" />
              {/* Top-Right Finder */}
              <rect x="70" y="5" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="5" />
              <rect x="77" y="12" width="11" height="11" />
              {/* Bottom-Left Finder */}
              <rect x="5" y="70" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="5" />
              <rect x="12" y="77" width="11" height="11" />
              {/* Decorative Matrix Modules */}
              <rect x="36" y="8" width="6" height="6" />
              <rect x="48" y="15" width="6" height="6" />
              <rect x="58" y="8" width="6" height="6" />
              <rect x="36" y="24" width="6" height="6" />
              <rect x="12" y="38" width="6" height="6" />
              <rect x="22" y="48" width="6" height="6" />
              <rect x="72" y="38" width="6" height="6" />
              <rect x="82" y="48" width="6" height="6" />
              <rect x="38" y="72" width="6" height="6" />
              <rect x="48" y="80" width="6" height="6" />
              <rect x="65" y="75" width="6" height="6" />
              <rect x="78" y="82" width="6" height="6" />
              {/* Central Non-Scannable Shield Symbol */}
              <circle cx="50" cy="50" r="14" fill="#0f172a" />
              <text x="50" y="54" fontSize="12" fill="#38bdf8" textAnchor="middle" fontWeight="bold">🛡️</text>
            </svg>
          </div>

          <p className="text-[10px] text-cyan-400 font-mono font-bold tracking-wider uppercase mb-3">
            [Fictional Matrix • Non-Scannable Training Mockup]
          </p>

          {/* Scenario Context */}
          <div className="bg-navy-950/90 p-4 rounded-xl border border-navy-800 text-left text-sm text-slate-100 leading-relaxed font-medium">
            {messageBody}
          </div>
        </div>
      )}

      {/* =========================================================================
          6. OTP / BANKING WARNING CARD (Mock alert, Demo Bank, Training only)
         ========================================================================= */}
      {type === 'bank_otp' && (
        <div className="p-4 sm:p-5 bg-gradient-to-b from-[#111c33] to-[#0a1020] text-left">
          {/* Fictional Bank Header */}
          <div className="bg-[#1e293b] p-3 rounded-xl border border-navy-700 flex items-center justify-between mb-3 shadow-md">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🏦</span>
              <div>
                <h4 className="text-sm font-black text-white">Demo Bank of Digital Defense</h4>
                <p className="text-[10px] text-navy-400 font-mono">Fictional Financial Institution</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-600/50 text-[10px] font-bold">
              Fraud Guard Alert
            </span>
          </div>

          {/* Critical Security Warning */}
          <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-200 text-xs mb-3 flex items-start gap-2">
            <span className="text-base leading-none">🚫</span>
            <div>
              <p className="font-black text-rose-100">STRICT SECURITY RULE:</p>
              <p className="text-[11px] leading-tight">
                Demo Bank staff will NEVER call, message, or email asking for your OTP, PIN, or password.
              </p>
            </div>
          </div>

          {/* Simulated OTP / Alert Content */}
          <div className="bg-navy-950 p-4 rounded-xl border border-navy-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-navy-400">
              <span className="font-mono">Demo SMS Notification</span>
              <span>Just now</span>
            </div>

            <div className="text-white text-sm sm:text-base font-medium leading-relaxed">
              {messageBody}
            </div>

            {/* Mock OTP Display */}
            <div className="my-3 p-3 rounded-xl bg-navy-900 border border-shield-500/40 text-center">
              <span className="text-[10px] uppercase font-mono font-bold text-navy-400 block mb-0.5">
                Simulated One-Time Code:
              </span>
              <span className="text-2xl sm:text-3xl font-mono font-black text-shield-300 tracking-widest">
                DEMO-489201
              </span>
            </div>

            <p className="text-[10px] text-navy-400 italic">
              Notice: Sharing verification codes allows attackers to drain digital wallets and take over accounts.
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          7. EDUCATIONAL SAFE PRACTICE / SCHOOL NOTICE CARD
         ========================================================================= */}
      {type === 'safe_notice' && (
        <div className="p-5 sm:p-6 bg-gradient-to-b from-[#0c221c] to-[#071310] text-left">
          {/* Verified Header */}
          <div className="flex items-center gap-3 pb-3 mb-3 border-b border-emerald-900/60">
            <div className="w-10 h-10 rounded-full bg-emerald-950 border border-emerald-500/60 flex items-center justify-center text-xl text-emerald-300">
              🛡️
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>{isUrdu ? 'اسکول اور خاندانی حفاظتی گائیڈ' : 'Official Notice / Verified Safe Habit'}</span>
                <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-600/50">
                  Verified
                </span>
              </h4>
              <p className="text-xs text-emerald-300/80">
                {isUrdu ? 'محفوظ ڈیجیٹل طرزِ عمل کی مثال' : 'Demonstration of legitimate & safe digital practice'}
              </p>
            </div>
          </div>

          <div className="bg-navy-950/80 p-4 rounded-xl border border-emerald-800/40 text-white text-sm sm:text-base font-medium leading-relaxed">
            {messageBody}
          </div>

          <div className="mt-3 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-700/30 text-[11px] text-emerald-200 flex items-center gap-2">
            <span>💡</span>
            <span>
              {isUrdu
                ? 'یہ عام معلومات ہے جس میں آپ سے کوئی خفیہ پاس ورڈ یا رقم طلب نہیں کی گئی۔'
                : 'Legitimate announcements inform you without soliciting secret passwords, OTPs, or urgent money.'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
