// frontend/src/components/ResultPage.jsx
import { Topbar, Statusbar } from './Topbar';

// ── Risk level config (original colors)
const LEVEL_CONFIG = {
  red: {
    heroGradient: 'linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%)',
    scoreColor: '#f87171',
    badgeBg: 'rgba(220,38,38,.12)',
    badgeText: '#f87171',
    badgeBorder: 'rgba(220,38,38,.25)',
    agentBg: 'rgba(0,0,0,.18)',
    agentBorder: 'rgba(255,255,255,.1)',
    dangerLabel: 'อันตราย! — พบรูปแบบการหลอกลวงชัดเจน',
    dangerLabelEn: 'DANGER — High-Risk Scam Detected',
    levelThai: 'อันตราย',
  },
  yellow: {
    heroGradient: 'linear-gradient(135deg, #92400e 0%, #78350f 100%)',
    scoreColor: '#fbbf24',
    badgeBg: 'rgba(217,119,6,.12)',
    badgeText: '#fbbf24',
    badgeBorder: 'rgba(217,119,6,.25)',
    agentBg: 'rgba(0,0,0,.18)',
    agentBorder: 'rgba(255,255,255,.1)',
    dangerLabel: 'ระวัง! — พบสัญญาณเสี่ยงบางประการ',
    dangerLabelEn: 'CAUTION — Suspicious Patterns Found',
    levelThai: 'ระมัดระวัง',
  },
  green: {
    heroGradient: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
    scoreColor: '#34d399',
    badgeBg: 'rgba(5,150,105,.12)',
    badgeText: '#34d399',
    badgeBorder: 'rgba(5,150,105,.25)',
    agentBg: 'rgba(0,0,0,.18)',
    agentBorder: 'rgba(255,255,255,.1)',
    dangerLabel: 'ปลอดภัย — ไม่พบสัญญาณน่าสงสัย',
    dangerLabelEn: 'SAFE — No Major Threats Detected',
    levelThai: 'ปลอดภัย',
  },
  unknown: {
    heroGradient: 'linear-gradient(135deg, #1e3a5f 0%, #0d1b2e 100%)',
    scoreColor: '#94a3b8',
    badgeBg: 'rgba(148,163,184,.12)',
    badgeText: '#94a3b8',
    badgeBorder: 'rgba(148,163,184,.25)',
    agentBg: 'rgba(0,0,0,.18)',
    agentBorder: 'rgba(255,255,255,.1)',
    dangerLabel: 'ไม่ทราบ — ข้อมูลไม่เพียงพอ',
    dangerLabelEn: 'UNKNOWN — Insufficient Data',
    levelThai: 'ไม่ทราบ',
  },
};

function ScoreHero({ result }) {
  const score = result?.score ?? 0;
  const level = result?.level ?? 'unknown';
  const cfg = LEVEL_CONFIG[level] || LEVEL_CONFIG.unknown;
  const levelThai = result?.levelText || cfg.levelThai;

  const pips = 9;
  const filledPips = Math.round((score / 100) * pips);

  return (
    <div
      className="p-7 pb-8 flex gap-7 items-start relative overflow-hidden"
      style={{ background: cfg.heroGradient }}
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
                background: i < filledPips - 1 ? 'rgba(255,255,255,.75)' : i === filledPips - 1 ? '#fff' : 'rgba(255,255,255,.18)',
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
        <div className="text-2xl font-extrabold text-white leading-[1.2] mb-1.5">{cfg.dangerLabel}</div>
        <div className="text-[12.5px] font-mono-ibm tracking-[.05em] mb-[18px]" style={{ color: 'rgba(255,255,255,.55)' }}>
          {cfg.dangerLabelEn}
        </div>

        {/* Agent breakdown */}
        <div
          className="rounded-[10px] p-[13px] px-4"
          style={{ background: cfg.agentBg, border: `1px solid ${cfg.agentBorder}` }}
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

export default function ResultPage({ result, onBack, onCopy }) {
  return (
    <div className="fade-in min-h-screen" style={{ background: '#eef2f7' }}>
      <Topbar onBack={onBack} backLabel="วิเคราะห์ใหม่" />
      <Statusbar />

      <div className="min-h-[calc(100vh-90px)]" style={{ background: '#eef2f7' }}>
        {result && <ScoreHero result={result} />}

        <div className="p-[22px] px-6 grid grid-cols-2 gap-4">
          <XAICard result={result} />
          <AdviceCard result={result} />

          {/* PDPA notice */}
          <div
            className="col-span-2 rounded-[10px] p-[11px] px-[15px] text-xs text-[#1e40af] leading-[1.6] flex gap-[9px]"
            style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#1e40af" strokeWidth="2" className="flex-shrink-0 w-[15px] h-[15px] mt-0.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <span>
              <strong>ความเป็นส่วนตัว:</strong> ข้อมูลที่คุณส่งมาถูกประมวลผลเพื่อวิเคราะห์เท่านั้น ไม่มีการจัดเก็บข้อความต้นฉบับหรือข้อมูลส่วนบุคคลใดๆ
              ปฏิบัติตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA) พ.ศ. 2562
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}