import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ShieldIcon from './ShieldIcon';

/**
 * DojoIdBadge — Compact wallet-size "Cyber Guardian ID Card"
 * Designed for school lanyard, badge holder, or wallet (credit-card size ~ 85.6mm x 53.98mm).
 * Renders purely client-side with html2canvas export.
 */
export default function DojoIdBadge({ name, schoolName, role, levelName, badge, levelNum, score, date, isUrdu = false }) {
  const cardRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  const displayName = name?.trim() || (isUrdu ? '(نام درج کریں)' : '(Enter Name)');
  const displaySchool = schoolName?.trim();
  const displayDate = date
    ? new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const badgeTitle = badge || 'Cyber Guardian';
  const idCode = `HD-L${levelNum || 'X'}-${Date.now().toString(36).toUpperCase().slice(-5)}`;

  async function handleExportPNG() {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#0e1d38',
        logging: false,
      });
      const dataUrl = canvas.toDataURL('image/png');
      const safeName = displayName.replace(/[^a-zA-Z0-9_-]/g, '_');
      const link = document.createElement('a');
      link.download = `Hifazat-Dojo-ID-Badge-${safeName}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export ID badge as PNG', err);
    } finally {
      setIsExporting(false);
    }
  }

  async function handleExportPDF() {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#0e1d38',
        logging: false,
      });
      const imgData = canvas.toDataURL('image/png');
      // Credit card size in mm: 85.6 x 53.98
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.6, 53.98],
      });
      pdf.addImage(imgData, 'PNG', 0, 0, 85.6, 53.98);
      const safeName = displayName.replace(/[^a-zA-Z0-9_-]/g, '_');
      pdf.save(`Hifazat-Dojo-ID-Badge-${safeName}.pdf`);
    } catch (err) {
      console.error('Failed to export ID badge as PDF', err);
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* The Card Itself (Credit-card ratio ≈ 1.586:1) */}
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-2xl border-2 border-shield-500/50 shadow-2xl shadow-shield-500/15"
        style={{
          width: '100%',
          maxWidth: '430px',
          aspectRatio: '1.586 / 1',
          background: 'linear-gradient(135deg, #081126 0%, #0e1d38 30%, #132e56 60%, #0a1628 100%)',
        }}
      >
        {/* Security Corner Brackets */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-shield-400/60" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-shield-400/60" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-shield-400/60" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-shield-400/60" />

        {/* Faint Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none">
          <ShieldIcon size={180} />
        </div>

        <div className="relative z-10 p-3 sm:p-4 flex flex-col justify-between h-full">
          {/* Card Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-shield-500/20 border border-shield-400/40 flex-shrink-0">
                <ShieldIcon size={22} />
              </div>
              <div className="leading-none">
                <p className="text-[10px] sm:text-xs font-black text-shield-300 tracking-wide">HIFAZAT DOJO</p>
                <p className="text-[8px] sm:text-[9px] text-navy-300 font-mono font-bold tracking-widest uppercase">Cyber Guardian ID</p>
              </div>
            </div>
            <div className="text-right leading-none">
              <p className="text-[8px] text-navy-400 font-mono">{idCode}</p>
              {displaySchool && (
                <p className="text-[8px] sm:text-[9px] text-shield-200/70 font-bold max-w-[110px] truncate">
                  🏫 {displaySchool}
                </p>
              )}
            </div>
          </div>

          {/* Guardian Name */}
          <div className="text-center py-1">
            <p className="text-white text-base sm:text-lg md:text-xl font-black tracking-tight leading-tight" dir="auto">
              {displayName}
            </p>
            {role && (
              <span className="inline-block mt-0.5 px-2 py-0.5 text-[8px] sm:text-[9px] font-bold uppercase rounded-full bg-shield-500/20 text-shield-300 border border-shield-500/40 tracking-wider">
                {role}
              </span>
            )}
          </div>

          {/* Achievement Banner */}
          <div className="flex items-center justify-between gap-2 text-[9px] sm:text-[10px]">
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg">🏅</span>
              <div className="leading-tight">
                <p className="text-amber-300 font-black">{badgeTitle}</p>
                <p className="text-navy-300 font-mono text-[8px]">{levelName || 'Community Guardian'}</p>
              </div>
            </div>
            <div className="text-right leading-tight">
              <p className="text-white font-black">Score: {score || '100'}/100</p>
              <p className="text-navy-300 font-mono text-[8px]">{displayDate}</p>
            </div>
          </div>

          {/* Bottom Stripe */}
          <div className="flex items-center justify-between pt-1 mt-1 border-t border-shield-500/20">
            <p className="text-[7px] sm:text-[8px] text-navy-400 font-mono">
              STREAM Project Exhibition 2026 • Offline Verified
            </p>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-shield-400 animate-pulse" />
              <span className="text-[7px] text-shield-400 font-bold font-mono">VALID</span>
            </div>
          </div>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex flex-wrap items-center gap-2 no-print">
        <button
          onClick={handleExportPNG}
          disabled={isExporting || !name?.trim()}
          className="btn-secondary text-xs py-2 px-3 cursor-pointer disabled:opacity-40 border-emerald-500/50 text-emerald-300 hover:text-white"
        >
          {isExporting ? '⏳ ...' : '📥'} {isUrdu ? 'آئی ڈی کارڈ PNG' : 'Download ID Card PNG'}
        </button>
        <button
          onClick={handleExportPDF}
          disabled={isExporting || !name?.trim()}
          className="btn-secondary text-xs py-2 px-3 cursor-pointer disabled:opacity-40 border-shield-500/50 text-shield-300 hover:text-white"
        >
          {isExporting ? '⏳ ...' : '📄'} {isUrdu ? 'آئی ڈی کارڈ PDF' : 'Download ID Card PDF'}
        </button>
      </div>
    </div>
  );
}

