// frontend/src/components/InputPage.jsx
import { useState, useRef } from 'react';
import { Topbar, Statusbar } from './Topbar';

const INPUT_TYPES = [
  {
    id: 'text', label: 'Text / SMS ข้อความ', sub: 'Paste message',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-full h-full">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
  },
  {
    id: 'url', label: 'URL / Link เว็บไซต์', sub: 'Check website',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-full h-full">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
  {
    id: 'image', label: 'Screenshot รูปภาพ', sub: 'Upload image',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-full h-full">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    ),
  },
  {
    id: 'audio', label: 'Voice / Audio คลิปเสียง', sub: 'Record audio',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-full h-full">
        <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
        <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
      </svg>
    ),
  },
];

const LABEL_MAP = {
  text: 'Paste content วางข้อความ',
  url: 'Enter URL / Link เว็บไซต์',
  image: 'Upload Screenshot รูปภาพ',
  audio: 'Record Voice / Audio เสียง',
};

export default function InputPage({ onAnalyze, error }) {
  const [selType, setSelType] = useState('text');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [shake, setShake] = useState(false);
  const fileRef = useRef(null);

  const isFileType = selType === 'image' || selType === 'audio';

  const handleSubmit = () => {
    if (!content.trim() && !file) {
      setShake(true);
      setTimeout(() => setShake(false), 1500);
      return;
    }
    const fd = new FormData();
    fd.append('inputType', selType);
    if (isFileType) {
      if (file) fd.append('file', file);
    } else if (selType === 'url') {
      fd.append('url', content.trim());
    } else {
      fd.append('text', content.trim());
    }
    onAnalyze(fd, content.trim());
  };

  return (
    <div className="fade-in min-h-screen" style={{ background: '#eef2f7' }}>
      <Topbar />
      <Statusbar />

      <div className="p-11 px-6 min-h-[calc(100vh-90px)]" style={{ background: '#eef2f7' }}>
        <div
          className="max-w-[820px] mx-auto rounded-2xl overflow-hidden"
          style={{ background: '#ffffff', boxShadow: '0 2px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)' }}
        >
          {/* Card header */}
          <div
            className="px-[22px] py-[13px] flex items-center justify-between"
            style={{ background: '#0d1b2e' }}
          >
            <div className="flex items-center gap-2.5 font-mono-ibm text-[11px] font-semibold tracking-[0.1em] text-[#94a3b8]">
              <div className="flex gap-[5px]">
                <div className="w-[9px] h-[9px] rounded-full" style={{ background: '#2563eb' }} />
                <div className="w-[9px] h-[9px] rounded-full opacity-50" style={{ background: '#0891b2' }} />
              </div>
              INPUT YOUR INFORMATION
            </div>
            <div className="text-[11px] text-[#64748b]">Select type · Paste content · Analyze</div>
          </div>

          {/* Card body */}
          <div className="p-6 pb-[22px]">
            {/* Type selector */}
            <div className="grid grid-cols-4 gap-2.5 mb-[22px]">
              {INPUT_TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setSelType(t.id); setContent(''); setFile(null); }}
                  className="border-[1.5px] rounded-xl p-4 px-3 cursor-pointer text-left transition-all"
                  style={{
                    borderColor: selType === t.id ? '#2563eb' : '#e2e8f0',
                    background: selType === t.id ? '#eff6ff' : '#fafbfd',
                    boxShadow: selType === t.id ? '0 0 0 3px rgba(37,99,235,.08)' : 'none',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={(e) => { if (selType !== t.id) { e.currentTarget.style.borderColor = '#93c5fd'; e.currentTarget.style.background = '#f0f7ff'; } }}
                  onMouseLeave={(e) => { if (selType !== t.id) { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#fafbfd'; } }}
                >
                  <div className="w-7 h-7 mb-[9px]" style={{ color: selType === t.id ? '#2563eb' : '#94a3b8' }}>
                    {t.icon}
                  </div>
                  <div className="text-[12.5px] font-semibold" style={{ color: selType === t.id ? '#2563eb' : '#1e293b' }}>
                    {t.label}
                  </div>
                  <div className="text-[11px] text-[#94a3b8] mt-0.5">{t.sub}</div>
                </button>
              ))}
            </div>

            {/* Label row */}
            <div className="flex justify-between items-center mb-[9px]">
              <label className="text-[12.5px] font-semibold text-[#334155]">
                {LABEL_MAP[selType]}
              </label>
              {!isFileType && (
                <span className="font-mono-ibm text-[11px] text-[#94a3b8]">{content.length} chars</span>
              )}
            </div>

            {/* Input area */}
            {isFileType ? (
              <div
                className="w-full min-h-[130px] border-[1.5px] rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all"
                style={{ borderColor: '#e2e8f0', background: '#fafbfd', borderStyle: 'dashed' }}
                onClick={() => fileRef.current?.click()}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#93c5fd'; e.currentTarget.style.background = '#f0f7ff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#fafbfd'; }}
              >
                <input
                  ref={fileRef}
                  type="file"
                  className="hidden"
                  accept={selType === 'image' ? 'image/*' : 'audio/*'}
                  onChange={(e) => setFile(e.target.files[0] || null)}
                />
                <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" className="w-8 h-8">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <div className="text-sm text-[#64748b]">
                  {file ? <span className="text-[#2563eb] font-semibold">{file.name}</span> : `คลิกเพื่อเลือกไฟล์ ${selType === 'image' ? 'รูปภาพ' : 'เสียง'}`}
                </div>
                <div className="text-[11px] text-[#94a3b8]">
                  {selType === 'image' ? 'JPEG, PNG, WebP — max 5MB' : 'MP3, WAV, MP4, WebM — max 5MB'}
                </div>
              </div>
            ) : (
              <textarea
                className="w-full min-h-[130px] border-[1.5px] rounded-xl p-[14px] px-4 text-[13.5px] text-[#334155] resize-y outline-none transition-all leading-[1.65]"
                style={{
                  borderColor: shake ? '#ef4444' : '#e2e8f0',
                  background: '#fafbfd',
                  fontFamily: 'inherit',
                }}
                placeholder={selType === 'url'
                  ? 'https://suspicious-website.com/th/login'
                  : "วางข้อความน่าสงสัย เช่น : 'แจ้งเตือน!! บัญชีของคุณถูกระงับ...'"
                }
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                onFocus={(e) => { e.target.style.borderColor = '#93c5fd'; e.target.style.background = '#fff'; }}
                onBlur={(e) => { e.target.style.borderColor = shake ? '#ef4444' : '#e2e8f0'; e.target.style.background = '#fafbfd'; }}
              />
            )}

            {/* Error */}
            {error && (
              <div className="mt-4 p-3 rounded-xl text-sm text-red-300 border border-red-800 bg-red-950">
                ⚠️ {error}
              </div>
            )}

            {/* CTA Button */}
            <button
              onClick={handleSubmit}
              className="w-full mt-5 py-4 rounded-xl text-[15px] font-bold text-white flex items-center justify-center gap-[9px] cursor-pointer transition-all"
              style={{
                background: '#2563eb',
                border: 'none',
                fontFamily: 'inherit',
                letterSpacing: '.01em',
                boxShadow: '0 3px 18px rgba(37,99,235,.3)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#1d4ed8'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 5px 24px rgba(37,99,235,.4)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#2563eb'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 3px 18px rgba(37,99,235,.3)'; }}
              onMouseDown={(e) => { e.currentTarget.style.transform = ''; }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-[17px] h-[17px]">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              Analyze for Risks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}