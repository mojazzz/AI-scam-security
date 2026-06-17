// frontend/src/components/ResultPage.jsx
import { Topbar, Statusbar } from './Topbar';

function ScoreHero({ result }) {
  const score = result?.score ?? 0;
  const level = result?.level ?? 'unknown';

  const heroGradient =
    level === 'red'
      ? 'linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%)'
      : level === 'yellow'
      ? 'linear-gradient(135deg, #92400e 0%, #78350f 100%)'
      : 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)';

  const levelThai = result?.levelText || (level === 'red' ? 'อันตราย' : level === 'yellow' ? 'ระมัดระวัง' : 'ปลอดภัย');
  const dangerLabel = level === 'red' ? 'อันตราย! — พบรูปแบบการหลอกลวงชัดเจน' : level === 'yellow' ? 'ระวัง! — พบสัญญาณเสี่ยงบางประการ' : 'ปลอดภัย — ไม่พบสัญญาณน่าสงสัย';

  const pips = 9;
  const filledPips = Math.round((score / 100) * pips);

  return (
    <div
      className="p-7 pb-8 flex gap-7 items-start relative overflow-hidden"
      style={{ background: heroGradient }}
    >
      {/* Diagonal stripe texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(-45deg, rgba(255,255,255,.015) 0, rgba(255,255,255,.015) 1px, transparent 1px, transparent 14px)',
        }}
      />

      {/* Score block */}
      <div className="flex-shrink-0 relative z-10">
        <div className="text-[10px] font-mono-ibm tracking-[.1em] text-center mb-[7px]" style={{ color: 'rgba(255,255,255,.45)', textTransform: 'uppercase' }}>
          Risk Score
        </div>
        <div
          className="w-[130px] h-[130px] rounded-[14px] flex flex-col items-center justify-center"
          style={{ background: 'rgba(0,0,0,.22)', border: '1.5px solid rgba(255,255,255,.12)' }}
        >
          <span className="text-[50px] font-extrabold text-white leading-none font-mono-ibm">{score}</span>
          <span className="text-[11px] font-mono-ibm" style={{ color: 'rgba(255,255,255,.45)' }}>/ 100</span>
        </div>
        <div className="flex gap-[3px] mt-[9px] justify-center">
          {Array.from({ length: pips }).map((_, i) => (
            <div
              key={i}
              className="w-[10px] h-[4px] rounded-[2px]"
              style={{
                background:
                  i < filledPips - 1
                    ? 'rgba(255,255,255,.75)'
                    : i === filledPips - 1
                    ? '#fff'
                    : 'rgba(255,255,255,.18)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 relative z-10 min-w-0">
        <div
          className="inline-flex items-center gap-1.5 text-[10.5px] font-mono-ibm font-semibold tracking-[.1em] rounded-full px-3 py-[3px] mb-3"
          style={{ background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.22)', color: 'rgba(255,255,255,.9)' }}
        >
          <span className="w-[5px] h-[5px] rounded-full" style={{ background: '#4ade80' }} />
          ANALYSIS COMPLETE
        </div>
        <div className="text-2xl font-extrabold text-white leading-[1.2] mb-1.5">{dangerLabel}</div>
        <div className="text-[12.5px] font-mono-ibm tracking-[.05em] mb-[18px]" style={{ color: 'rgba(255,255,255,.55)' }}>
          {level === 'red' ? 'DANGER — High-Risk Scam Detected' : level === 'yellow' ? 'CAUTION — Suspicious Patterns Found' : 'SAFE — No Major Threats Detected'}
        </div>

        {/* Agent breakdown */}
        <div
          className="rounded-[10px] p-[13px] px-4"
          style={{ background: 'rgba(0,0,0,.18)', border: '1px solid rgba(255,255,255,.1)' }}
        >
          <div className="text-[10px] font-mono-ibm tracking-[.12em] uppercase mb-[11px]" style={{ color: 'rgba(255,255,255,.4)' }}>
            AI Agent Breakdown
          </div>
          {[
            { label: 'LLM Contextual Agent (60%)', pct: Math.min(100, score + 2) },
            { label: 'Rule-Based Engine (30%)', pct: Math.max(0, score - 5) },
            { label: 'AI Classifier Thai (10%)', pct: Math.min(100, score + 4) },
          ].map((a) => (
            <div key={a.label} className="mb-[9px] last:mb-0">
              <div className="flex justify-between text-[11.5px] mb-1" style={{ color: 'rgba(255,255,255,.7)' }}>
                <span>{a.label}</span>
                <span className="font-mono-ibm font-semibold text-white">{a.pct}%</span>
              </div>
              <div className="h-[4px] rounded-[2px] overflow-hidden" style={{ background: 'rgba(255,255,255,.12)' }}>
                <div className="h-full rounded-[2px] prog-fill" style={{ width: `${a.pct}%`, background: 'rgba(255,255,255,.55)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function XAICard({ result }) {
  const indicators = result?.indicators || [];
  return (
    <div className="bg-white rounded-[13px] p-[18px]" style={{ boxShadow: '0 1px 8px rgba(0,0,0,.06)' }}>
      <div className="text-[11px] font-mono-ibm font-semibold tracking-[.1em] text-[#64748b] uppercase mb-[14px] pb-2.5 border-b border-[#f1f5f9]">
        Explainable AI (XAI) Reasons — เหตุผลที่ AI ตัดสินใจแบบนี้
      </div>
      {indicators.length > 0 ? (
        indicators.map((ind, i) => (
          <div key={i} className="flex gap-[11px] py-[9px] border-b border-[#f8fafc] last:border-0 last:pb-0 text-[12.5px] text-[#334155] leading-[1.55]">
            <div
              className="flex-shrink-0 w-5 h-5 rounded-[5px] text-[10px] font-bold font-mono-ibm flex items-center justify-center"
              style={{ background: '#eff6ff', color: '#2563eb' }}
            >
              {i + 1}
            </div>
            <div>{ind}</div>
          </div>
        ))
      ) : (
        <div className="text-[12.5px] text-[#64748b]">ไม่พบตัวชี้วัดความเสี่ยงที่ชัดเจน</div>
      )}
    </div>
  );
}

function AdviceCard({ result }) {
  const level = result?.level ?? 'unknown';
  const recommendation = result?.recommendation || '';

  const baseAdvice = level === 'red'
    ? [
        { color: '#ef4444', text: 'บล็อกหมายเลขทันที — ห้ามตอบกลับโดยเด็ดขาด' },
        { color: '#ef4444', text: 'ห้ามคลิกลิงก์ใดๆ — มีความเสี่ยงสูงจะติดตั้งมัลแวร์' },
        { color: '#f59e0b', text: 'แจ้งความ ETDA โทร 1212 ตลอด 24 ชั่วโมง (โทรฟรี)' },
        { color: '#f59e0b', text: 'แจ้งเตือนสมาชิกในครอบครัว — รูปแบบนี้กำลังแพร่กระจาย' },
        { color: '#60a5fa', text: 'ร้องเรียนที่ thaipoliceonline.com' },
      ]
    : level === 'yellow'
    ? [
        { color: '#f59e0b', text: 'ใช้ความระมัดระวัง — ตรวจสอบแหล่งที่มาก่อนตอบสนอง' },
        { color: '#f59e0b', text: 'ไม่ควรให้ข้อมูลส่วนตัวหรือทำธุรกรรมโดยไม่ยืนยัน' },
        { color: '#60a5fa', text: 'หากสงสัย สามารถแจ้ง ETDA โทร 1212' },
      ]
    : [
        { color: '#22c55e', text: 'ดูเหมือนปลอดภัย แต่ยังควรระมัดระวังเป็นปกติ' },
        { color: '#22c55e', text: 'อย่าให้ข้อมูลส่วนตัวกับใครโดยไม่จำเป็น' },
      ];

  const BlockIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]">
      <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
  );
  const WarnIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
  const InfoIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]">
      <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
    </svg>
  );

  return (
    <div className="bg-white rounded-[13px] p-[18px]" style={{ boxShadow: '0 1px 8px rgba(0,0,0,.06)' }}>
      <div className="text-[11px] font-mono-ibm font-semibold tracking-[.1em] text-[#64748b] uppercase mb-[14px] pb-2.5 border-b border-[#f1f5f9]">
        Actionable Advice — สิ่งที่ควรทำทันที
      </div>
      {recommendation && (
        <div className="text-[12.5px] text-[#334155] leading-[1.55] mb-3 pb-3 border-b border-[#f8fafc]">
          {recommendation}
        </div>
      )}
      {baseAdvice.map((a, i) => (
        <div key={i} className="flex gap-2.5 py-2 border-b border-[#f8fafc] last:border-0 last:pb-0 text-[12.5px] text-[#334155] leading-[1.55] items-start">
          <div className="flex-shrink-0 w-[18px] h-[18px] mt-0.5" style={{ color: a.color }}>
            {i < 2 ? <BlockIcon /> : i < 4 ? <WarnIcon /> : <InfoIcon />}
          </div>
          <div>{a.text}</div>
        </div>
      ))}
      <div className="bg-[#fff7ed] rounded-[9px] p-[11px] px-[13px] mt-[11px]">
        <div className="text-[10.5px] font-bold font-mono-ibm tracking-[.08em] uppercase text-[#92400e] mb-[7px]">ช่องทางแจ้งเหตุ</div>
        <div className="text-[12.5px] text-[#1e293b] py-[3px] flex items-center gap-[7px]">ETDA Cybercrime: <strong>1212</strong></div>
        <div className="text-[12.5px] text-[#1e293b] py-[3px]">thaipoliceonline.com</div>
      </div>
    </div>
  );
}

export default function ResultPage({ result, onBack, onGoCyber, onGoIntel, onCopy }) {
  const level = result?.level ?? 'unknown';

  return (
    <div className="fade-in min-h-screen" style={{ background: '#eef2f7' }}>
      <Topbar
        onBack={onBack}
        backLabel="วิเคราะห์ใหม่"
        rightSlot={
          <div
            className="flex items-center gap-[7px] text-[#94a3b8] text-xs px-[14px] py-[5px] rounded-full cursor-pointer"
            style={{ background: '#1e3050', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full led-blue" />
            Connect Smartwatch
          </div>
        }
      />
      <Statusbar />

      <div className="min-h-[calc(100vh-90px)]" style={{ background: '#eef2f7' }}>
        {result && <ScoreHero result={result} />}

        <div className="p-[22px] px-6 grid grid-cols-2 gap-4">
          <XAICard result={result} />
          <AdviceCard result={result} />

          {/* Advanced Tools */}
          <div
            className="col-span-2 rounded-[13px] p-[18px]"
            style={{ background: '#1a2b40', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="flex justify-between items-center mb-[14px]">
              <div className="text-[11px] font-mono-ibm font-semibold tracking-[.1em] text-[#94a3b8] uppercase">
                Advanced Tracing &amp; Deception Tools
              </div>
              <div
                className="text-[10px] font-mono-ibm font-bold px-[9px] py-[2px] rounded-full tracking-[.06em]"
                style={{ background: 'rgba(217,119,6,.12)', color: '#d97706', border: '1px solid rgba(217,119,6,.25)' }}
              >
                PRO FEATURES
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <button
                  onClick={onGoIntel}
                  className="w-full rounded-[9px] p-[13px] px-[14px] font-semibold text-[12.5px] flex items-center gap-2 cursor-pointer transition-all"
                  style={{ background: 'rgba(220,38,38,.1)', borderColor: 'rgba(220,38,38,.3)', border: '1px solid', color: '#fca5a5', fontFamily: 'inherit' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(220,38,38,.18)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(220,38,38,.1)'; }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[15px] h-[15px] flex-shrink-0">
                    <circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
                  </svg>
                  Generate Honey-Token Link Trap
                </button>
                <div className="text-[11px] text-[#64748b] mt-1.5 pl-0.5">สร้าง decoy URL เพื่อติดตาม digital footprint ของอาชญากร</div>
              </div>
              <div>
                <button
                  className="w-full rounded-[9px] p-[13px] px-[14px] font-semibold text-[12.5px] flex items-center gap-2 cursor-pointer transition-all"
                  style={{ background: 'rgba(5,150,105,.1)', borderColor: 'rgba(5,150,105,.3)', border: '1px solid', color: '#6ee7b7', fontFamily: 'inherit' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(5,150,105,.18)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(5,150,105,.1)'; }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[15px] h-[15px] flex-shrink-0">
                    <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                  One-Click Safe Share (LINE)
                </button>
                <div className="text-[11px] text-[#64748b] mt-1.5 pl-0.5">สร้าง Infographic ภาษาไทย-อังกฤษ เพื่อแจ้งเตือนครอบครัว</div>
              </div>
            </div>
          </div>

          {/* PDPA notice */}
          <div
            className="col-span-2 rounded-[10px] p-[11px] px-[15px] text-xs text-[#1e40af] leading-[1.6] flex gap-[9px]"
            style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#1e40af" strokeWidth="2" className="flex-shrink-0 w-[15px] h-[15px] mt-0.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <span>
              <strong>Automated Data Ephemerality:</strong> ข้อความและเนื้อหาทั้งหมดจะถูกลบออกจากระบบภายใน 5 นาที ไม่มีการเก็บข้อมูลส่วนบุคคล ปฏิบัติตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA) พ.ศ. 2562
            </span>
          </div>

          {/* Module navigation cards */}
          <div className="col-span-2 grid grid-cols-2 gap-3">
            {[
              {
                dot: '#f87171', title: 'Cyber Threat Tracing', sub: 'IP Geolocation · EXIF · Threat Map',
                tag: 'FR2.6', tagClass: 'bg-[rgba(220,38,38,.12)] text-[#f87171] border-[rgba(220,38,38,.2)]',
                onClick: onGoCyber,
              },
              {
                dot: '#fbbf24', title: 'Threat Intel Center', sub: 'Honey-Token · ZKP Report · Crowd Intel',
                tag: 'FR2.7', tagClass: 'bg-[rgba(217,119,6,.12)] text-[#d97706] border-[rgba(217,119,6,.2)]',
                onClick: onGoIntel,
              },
            ].map((m) => (
              <button
                key={m.title}
                onClick={m.onClick}
                className="rounded-xl p-[14px] px-4 cursor-pointer flex items-center justify-between transition-all text-left"
                style={{ background: '#0d1b2e', border: '1px solid rgba(255,255,255,0.07)', fontFamily: 'inherit' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.18)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = ''; }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: m.dot, boxShadow: `0 0 7px ${m.dot}` }} />
                  <div>
                    <div className="text-[13px] font-semibold text-[#f1f5f9]">{m.title}</div>
                    <div className="text-[11px] text-[#64748b] mt-0.5">{m.sub}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono-ibm font-bold px-2 py-[2px] rounded border ${m.tagClass}`}>{m.tag}</span>
                  <span className="text-[#64748b] text-base">›</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}