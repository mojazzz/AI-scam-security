// frontend/src/components/ThreatIntelPage.jsx
import { useState } from 'react';
import { Topbar } from './Topbar';

export default function ThreatIntelPage({ onBack }) {
  const [phone, setPhone] = useState('');
  const [lineId, setLineId] = useState('');
  const [account, setAccount] = useState('');
  const [zkpEnabled, setZkpEnabled] = useState(true);
  const [baitType, setBaitType] = useState('pdf');
  const [submitted, setSubmitted] = useState(false);
  const [trapGenerated, setTrapGenerated] = useState(false);
  const [trapUrl, setTrapUrl] = useState('');

  const handleGenTrap = () => {
    const fakeId = Math.random().toString(36).slice(2, 10).toUpperCase();
    setTrapUrl(`https://canary.scamshield.th/bait/${fakeId}?t=${baitType}`);
    setTrapGenerated(true);
  };

  const handleSubmitReport = () => {
    if (!phone && !lineId && !account) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setPhone(''); setLineId(''); setAccount('');
  };

  return (
    <div className="fade-in min-h-screen" style={{ background: '#0d1b2e' }}>
      <Topbar onBack={onBack} backLabel="กลับ" />

      {/* Intel sub-bar */}
      <div
        className="px-6 py-2.5 flex items-center justify-between"
        style={{ background: '#0a1520', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center gap-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-[30px] h-[30px] rounded-[7px] flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #d97706, #dc2626)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-4 h-4">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <div>
              <div className="text-xs font-bold text-[#f1f5f9] font-mono-ibm">THREAT INTEL CENTER</div>
              <div className="text-[10px] text-[#64748b]">Honey-Token · ZKP · Crowd Intel</div>
            </div>
          </div>
          <div className="text-[10.5px] font-mono-ibm font-bold tracking-[.08em] px-3 py-[3px] rounded-full text-[#34d399]" style={{ background: 'rgba(5,150,105,.12)', border: '1px solid rgba(5,150,105,.25)' }}>
            DB ONLINE
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="rounded-[7px] text-[11px] font-mono-ibm text-[#94a3b8] px-3 py-1" style={{ background: '#1e3050', border: '1px solid rgba(255,255,255,0.07)' }}>
            Reports Today: <strong className="text-[#34d399]">+342</strong>
          </div>
          <div className="rounded-[7px] text-[11px] font-mono-ibm text-[#94a3b8] px-3 py-1" style={{ background: '#1e3050', border: '1px solid rgba(255,255,255,0.07)' }}>
            Honey Traps: <strong>1,847 active</strong>
          </div>
        </div>
      </div>

      {/* 2-column layout */}
      <div className="grid min-h-[calc(100vh-170px)]" style={{ gridTemplateColumns: '380px 1fr' }}>
        {/* Left: search */}
        <div className="p-[18px] px-5" style={{ borderRight: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="rounded-xl p-4 mb-4" style={{ background: '#1a2b40', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="text-sm font-bold text-[#f1f5f9] mb-[5px]">Counter-Intelligence Search</div>
            <div className="text-xs text-[#64748b] leading-[1.55]">ค้นหาหมายเลขโทรศัพท์ LINE ID หรือเลขบัญชีธนาคารที่ต้องสงสัย แล้วเปิดใช้งานมาตรการตอบโต้ได้</div>
          </div>

          <div className="flex items-center gap-2 font-mono-ibm text-[10.5px] font-bold tracking-[.12em] text-[#64748b] uppercase mb-3 mt-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            Threat Target Input
          </div>

          {[
            { icon: <PhoneIcon />, label: 'หมายเลขโทรศัพท์', placeholder: '08x-xxx-xxxx', value: phone, set: setPhone },
            { icon: <ChatIcon />, label: 'Line ID / Social Handle', placeholder: '@scam_invest หรือ username', value: lineId, set: setLineId },
            { icon: <CardIcon />, label: 'หมายเลขบัญชีธนาคาร', placeholder: 'เลขบัญชี + ชื่อธนาคาร', value: account, set: setAccount },
          ].map((f) => (
            <div key={f.label} className="mb-[11px]">
              <div className="flex items-center gap-1.5 text-xs text-[#94a3b8] mb-1.5">
                <span className="w-[13px] h-[13px] text-[#64748b]">{f.icon}</span>
                {f.label}
              </div>
              <div
                className="w-full flex items-center gap-2 rounded-lg px-[13px] py-[9px] transition-all"
                style={{ background: '#0d1b2e', border: '1.5px solid rgba(255,255,255,0.07)' }}
                onFocus={() => {}}
              >
                <span className="w-[13px] h-[13px] flex-shrink-0 text-[#64748b]">{f.icon}</span>
                <input
                  type="text"
                  placeholder={f.placeholder}
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  className="flex-1 font-mono-ibm text-xs bg-transparent outline-none text-[#f1f5f9] placeholder:text-[#64748b]"
                  style={{ border: 'none' }}
                />
              </div>
            </div>
          ))}

          <button
            onClick={() => {}}
            className="w-full mt-1.5 rounded-[9px] py-[11px] font-semibold text-[13px] flex items-center justify-center gap-[7px] cursor-pointer transition-all text-[#94a3b8]"
            style={{ background: '#1e3050', border: '1px solid rgba(255,255,255,0.07)', fontFamily: 'inherit' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(96,165,250,.4)'; e.currentTarget.style.color = '#f1f5f9'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#94a3b8'; }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[14px] h-[14px]">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            Check Database &amp; Scan History
          </button>
        </div>

        {/* Right panel */}
        <div className="p-[18px] px-5 flex flex-col gap-[14px]">
          {/* Honey trap card */}
          <div className="rounded-xl p-4" style={{ background: '#1a2b40', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-2.5 mb-[14px]">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(220,38,38,.12)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" className="w-4 h-4">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div>
                <div className="text-[13px] font-bold text-[#f1f5f9]">Advanced Countermeasures</div>
                <div className="text-[11px] text-[#64748b] mt-0.5">ค้นหาก่อนเพื่อเปิดใช้งานระบบตอบโต้</div>
              </div>
            </div>

            {/* Trap box */}
            <div className="rounded-[10px] p-[13px] px-[14px] mb-3" style={{ background: '#0d1b2e', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center gap-2 mb-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" className="w-[15px] h-[15px]">
                  <circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
                </svg>
                <div className="text-[12.5px] font-bold text-[#f1f5f9]">Deploy Deception Trap</div>
                <div className="text-[9.5px] font-mono-ibm font-bold px-[7px] py-[2px] rounded" style={{ background: 'rgba(217,119,6,.12)', border: '1px solid rgba(217,119,6,.25)', color: '#d97706' }}>
                  Canary Honey-Token
                </div>
              </div>
              <div className="text-xs text-[#64748b] leading-[1.55] mb-[11px]">Turn the tables. Generate a decoy asset link to capture the scammer's real digital footprint legally when they click it out of greed.</div>
              <div className="font-mono-ibm text-[10.5px] tracking-[.08em] text-[#64748b] uppercase mb-[7px]">Bait Type</div>
              <div className="flex items-center justify-between rounded-lg px-3 py-[9px] cursor-pointer mb-[11px]" style={{ background: '#1a2b40', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center gap-2 text-[12.5px] text-[#f1f5f9]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" className="w-[14px] h-[14px]">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
                  </svg>
                  Fake Bank Transfer Slip (.pdf)
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9.5px] font-mono-ibm font-bold px-2 py-[2px] rounded" style={{ background: 'rgba(220,38,38,.12)', border: '1px solid rgba(220,38,38,.2)', color: '#f87171' }}>Most Effective</span>
                  <span className="text-[#64748b]">▾</span>
                </div>
              </div>
              {trapGenerated && (
                <div className="mb-3 p-2 px-3 rounded-lg font-mono-ibm text-[11px] break-all" style={{ background: 'rgba(5,150,105,.1)', border: '1px solid rgba(5,150,105,.3)', color: '#34d399' }}>
                  ✓ {trapUrl}
                </div>
              )}
              <button
                onClick={handleGenTrap}
                className="w-full rounded-lg py-[11px] font-bold text-[13px] flex items-center justify-center gap-[7px] cursor-pointer transition-all"
                style={{ background: 'rgba(220,38,38,.1)', border: '1px solid rgba(220,38,38,.3)', color: '#fca5a5', fontFamily: 'inherit' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(220,38,38,.18)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(220,38,38,.1)'; }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-[15px] h-[15px]">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                {trapGenerated ? 'Regenerate Honey-Trap Link' : 'Generate Honey-Trap Link'}
              </button>
            </div>
          </div>

          {/* Anonymous report card */}
          <div className="rounded-xl p-4" style={{ background: '#1a2b40', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-2.5 mb-[14px]">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(5,150,105,.12)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" className="w-4 h-4">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </div>
              <div>
                <div className="text-[13px] font-bold text-[#f1f5f9]">Privacy-First Anonymous Report</div>
                <div className="text-[11px] text-[#64748b] mt-0.5">รายงานแบบนิรนาม PDPA-Safe</div>
              </div>
            </div>
            <p className="text-xs text-[#64748b] leading-[1.55] mb-[13px]">Contribute to the central threat database. Your submission will be cryptographically hashed. Even we (the developers) cannot track who reported this or view your raw private chats.</p>

            <div className="font-mono-ibm text-[10.5px] font-bold tracking-[.12em] text-[#64748b] uppercase mb-3">สิ่งที่จะถูกส่งไปยังฐานข้อมูล</div>

            {[
              { label: 'หมายเลขโทรศัพท์ / Line ID (Hashed)', included: true, badge: 'HASHED', badgeColor: '#34d399', badgeBg: 'rgba(5,150,105,.12)', badgeBorder: 'rgba(5,150,105,.2)' },
              { label: 'หมายเลขบัญชีธนาคาร (Masked)', included: true, badge: 'MASKED', badgeColor: '#d97706', badgeBg: 'rgba(217,119,6,.12)', badgeBorder: 'rgba(217,119,6,.2)' },
              { label: 'ประเภทการหลอกลวง (Encoded)', included: true, badge: 'ENCODED', badgeColor: '#a5b4fc', badgeBg: 'rgba(99,102,241,.12)', badgeBorder: 'rgba(99,102,241,.2)' },
              { label: 'เนื้อหาการสนทนาส่วนตัว', included: false, badge: 'EXCLUDED', badgeColor: '#64748b', badgeBg: 'rgba(255,255,255,.04)', badgeBorder: 'rgba(255,255,255,0.07)' },
              { label: 'ข้อมูลตัวตนของผู้รายงาน', included: false, badge: 'EXCLUDED', badgeColor: '#64748b', badgeBg: 'rgba(255,255,255,.04)', badgeBorder: 'rgba(255,255,255,0.07)' },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-center py-[7.5px] border-b last:border-0 text-xs" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-[14px] h-[14px] rounded-[3px] flex-shrink-0 relative"
                    style={{
                      background: row.included ? 'rgba(5,150,105,.12)' : 'rgba(255,255,255,.03)',
                      border: row.included ? '1.5px solid rgba(5,150,105,.4)' : '1.5px solid rgba(255,255,255,.08)',
                    }}
                  >
                    {row.included && (
                      <span className="absolute text-[#34d399] text-[10px] font-bold" style={{ left: 1, top: -1 }}>✓</span>
                    )}
                  </div>
                  <span style={{ color: row.included ? '#94a3b8' : '#64748b' }}>{row.label}</span>
                </div>
                <span
                  className="font-mono-ibm text-[9.5px] font-bold px-2 py-[2px] rounded"
                  style={{ background: row.badgeBg, color: row.badgeColor, border: `1px solid ${row.badgeBorder}` }}
                >
                  {row.badge}
                </span>
              </div>
            ))}

            {/* ZKP Toggle */}
            <div className="flex justify-between items-center py-[11px] mt-2" style={{ borderTop: '1px solid rgba(255,255,255,.04)' }}>
              <div>
                <div className="text-xs text-[#f1f5f9] font-medium">Enable Homomorphic Cryptographic Hashing</div>
                <div className="text-[10.5px] text-[#64748b] mt-0.5">ยกระดับความปลอดภัยด้วย SHA-256 + ZKP protocol</div>
              </div>
              <label className="relative w-9 h-5 cursor-pointer flex-shrink-0">
                <input type="checkbox" checked={zkpEnabled} onChange={(e) => setZkpEnabled(e.target.checked)} className="opacity-0 w-0 h-0 absolute" />
                <span className="tslider" />
              </label>
            </div>

            {/* ZKP info bar */}
            <div className="rounded-lg p-[9px] px-3 flex gap-2 text-[11.5px] leading-[1.55] mb-3" style={{ background: 'rgba(5,150,105,.12)', border: '1px solid rgba(5,150,105,.2)', color: '#34d399' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[14px] h-[14px] flex-shrink-0 mt-0.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Zero-Knowledge Proof (ZKP) ช่วยให้พิสูจน์ข้อมูลของคุณถูกต้องโดยไม่เปิดเผยข้อมูลส่วนบุคคล — ตามหลักการ PDPA
            </div>

            {submitted && (
              <div className="mb-3 p-2 px-3 rounded-lg text-xs font-semibold" style={{ background: 'rgba(5,150,105,.15)', border: '1px solid rgba(5,150,105,.3)', color: '#34d399' }}>
                ✓ รายงานถูกส่งเรียบร้อยแล้ว — ขอบคุณที่ช่วยปกป้องชุมชน
              </div>
            )}

            <button
              onClick={handleSubmitReport}
              className="w-full font-bold text-[13.5px] rounded-[9px] py-[13px] flex items-center justify-center gap-2 cursor-pointer transition-all"
              style={{ background: 'rgba(5,150,105,.12)', border: '1px solid rgba(5,150,105,.3)', color: '#34d399', fontFamily: 'inherit', boxShadow: '0 2px 12px rgba(5,150,105,.1)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(5,150,105,.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(5,150,105,.12)'; }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[15px] h-[15px]">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
              Submit Anonymous ZKP Report
            </button>
          </div>

          {/* Crowd intel bar */}
          <div className="rounded-[10px] p-[13px] px-[15px] flex gap-[9px] text-[11.5px] text-[#64748b] leading-[1.6]" style={{ background: '#1a2b40', border: '1px solid rgba(255,255,255,0.07)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" className="w-[14px] h-[14px] flex-shrink-0 mt-0.5">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
            ระบบ Crowdsourced Intelligence: ข้อมูลทุกรายงานถูกรวบรวมเข้ากับ National Scam Registry แลกเปลี่ยนกับ ETDA · DSI · สำนักงานตำรวจแห่งชาติ ผ่านกรอบกฎหมาย MoU — ข้อมูลส่วนตัวของผู้รายงานได้รับการปกป้อง PDPA พ.ศ. 2562
          </div>
        </div>
      </div>
    </div>
  );
}

// Icon helpers
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
    <path d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 0112 18.54 19.5 19.5 0 015.19 12 19.79 19.79 0 012.1 3.22 2 2 0 014 1h3a2 2 0 012 1.72c.128.96.362 1.904.7 2.81a2 2 0 01-.45 2.11L8.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.34 1.85.574 2.81.7A2 2 0 0122 14.92z" />
  </svg>
);

const ChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);

const CardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);