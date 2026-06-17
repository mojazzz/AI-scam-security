// frontend/src/components/Topbar.jsx

// ── Shield icon
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-[18px] h-[18px]">
    <path d="M12 3L4 7v5c0 5.25 3.5 10.1 8 11.5C16.5 22.1 20 17.25 20 12V7L12 3z" />
  </svg>
);

const ArrowLeft = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

export function Topbar({ onBack, backLabel = 'กลับ', rightSlot }) {
  return (
    <nav
      className="h-14 px-7 flex items-center justify-between sticky top-0 z-[90]"
      style={{ background: '#0d1b2e', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="flex items-center gap-[11px]">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-[#94a3b8] text-xs px-[14px] py-[5px] rounded-[7px] border cursor-pointer transition-all hover:text-[#f1f5f9] hover:bg-[#1e3050]"
            style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'transparent', fontFamily: 'inherit' }}
          >
            <ArrowLeft />
            {backLabel}
          </button>
        )}
        <div
          className="w-[34px] h-[34px] rounded-[8px] flex items-center justify-center flex-shrink-0"
          style={{ background: '#2563eb' }}
        >
          <ShieldIcon />
        </div>
        <div>
          <div className="text-sm font-bold text-[#f1f5f9] tracking-[0.03em]">SCAM DETECTOR</div>
          <div className="text-[11px] text-[#64748b] tracking-[0.01em]">PDPA Compliant · AI Engine</div>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {rightSlot}
        <StatusPill color="green" label="AI Engine Online" />
      </div>
    </nav>
  );
}

export function StatusPill({ color = 'green', label }) {
  const dotClass = color === 'green' ? 'led-green' : color === 'blue' ? 'led-blue' : 'led-red';
  return (
    <div
      className="flex items-center gap-[7px] text-[#94a3b8] text-xs px-[14px] py-[5px] rounded-full cursor-pointer transition-all"
      style={{ background: '#1e3050', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotClass}`} />
      {label}
    </div>
  );
}

export function Statusbar() {
  const tags = [
    { color: 'bg-[#22c55e]', label: 'End-to-End Encrypted' },
    { color: 'bg-[#f87171]', label: '3-Agent AI Pipeline' },
    { color: 'bg-[#60a5fa]', label: 'Thai-Language NLP' },
    { color: 'bg-[#fbbf24]', label: '< 4s Analysis Time' },
    { color: 'bg-[#22c55e]', label: 'PDPA 2562 Compliant' },
  ];
  return (
    <div
      className="px-7 py-1.5 flex items-center gap-7 flex-wrap"
      style={{ background: '#152236', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
    >
      {tags.map((t) => (
        <div key={t.label} className="flex items-center gap-[5px] font-mono-ibm text-[11px] text-[#64748b]">
          <span className={`w-[5px] h-[5px] rounded-full ${t.color}`} />
          {t.label}
        </div>
      ))}
    </div>
  );
}