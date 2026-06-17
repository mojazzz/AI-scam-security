// frontend/src/components/CyberTracingPage.jsx
import { Topbar } from './Topbar';

const MOCK_DATA = {
  url: 'https://scam-bank-verify.com/th/login',
  domain: 'scam-bank-verify.com',
  registrar: 'NameCheap, Inc.',
  registeredDate: '2 วันที่แล้ว',
  expiryDate: '1 ปี',
  nameservers: 'ns1.cloudflare.com',
  ip: '185.220.101.47',
  country: '🇷🇺 Russia — Moscow',
  coords: '55.7558° N, 37.6176° E',
  domainAge: '2',
  ports: [
    { num: '443', name: 'HTTPS', status: 'safe' },
    { num: '80', name: 'HTTP', status: 'warn' },
    { num: '8080', name: 'Proxy', status: 'warn' },
    { num: '3389', name: 'RDP', status: 'danger' },
  ],
  hops: [
    { city: 'Bangkok', role: 'Origin', color: '#34d399' },
    { city: 'Singapore', role: 'VPN Node', color: '#fbbf24' },
    { city: 'Frankfurt', role: 'Relay', color: '#fbbf24' },
    { city: 'Moscow', role: 'Threat', color: '#f87171' },
  ],
};

function DarkCard({ label, badge, children }) {
  return (
    <div className="rounded-xl p-[14px] px-4 mb-[14px] last:mb-0" style={{ background: '#1a2b40', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex justify-between items-center mb-3">
        <div className="text-[10.5px] font-mono-ibm tracking-[.1em] text-[#64748b] uppercase">{label}</div>
        {badge && (
          <div className="text-[10px] font-mono-ibm font-bold px-[9px] py-[2px] rounded-[5px]" style={{ background: 'rgba(220,38,38,.12)', color: '#f87171', border: '1px solid rgba(220,38,38,.25)' }}>
            {badge}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

function MetaRow({ label, value, color }) {
  return (
    <div className="flex items-baseline py-[7.5px] border-b last:border-0 text-xs" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
      <div className="text-[#64748b] w-[148px] flex-shrink-0">{label}</div>
      <div className="font-mono-ibm text-[11.5px] flex-1" style={{ color: color || '#f1f5f9' }}>{value}</div>
    </div>
  );
}

function MapCanvas() {
  const dots = [
    { x: '10%', y: '62%', color: '#34d399', label: 'Bangkok' },
    { x: '72%', y: '58%', color: '#fbbf24', label: 'Singapore' },
    { x: '45%', y: '28%', color: '#fbbf24', label: 'Frankfurt' },
    { x: '56%', y: '22%', color: '#f87171', label: 'Moscow' },
  ];

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#1a2b40', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="px-[14px] py-2.5 flex justify-between items-center" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="text-[11px] font-mono-ibm font-bold text-[#f1f5f9] tracking-[.08em] uppercase">Threat Origin Map</div>
        <div className="flex items-center gap-[5px] text-[10px] font-mono-ibm text-[#34d399]">
          <span className="w-[5px] h-[5px] rounded-full led-green" />
          LIVE
        </div>
      </div>
      <div className="h-[180px] relative overflow-hidden" style={{ background: '#07140e' }}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(16,185,129,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,.06) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {dots.map((d, i) => (
          <div key={i}>
            <div
              className="absolute w-[7px] h-[7px] rounded-full"
              style={{ left: d.x, top: d.y, transform: 'translate(-50%,-50%)', background: d.color, boxShadow: `0 0 10px ${d.color}` }}
            />
            <div
              className="absolute font-mono-ibm text-[9px] whitespace-nowrap"
              style={{ left: d.x, top: `calc(${d.y} + 10px)`, transform: 'translateX(-50%)', color: 'rgba(255,255,255,.5)' }}
            >
              {d.label}
            </div>
          </div>
        ))}
        {/* Connection line */}
        <div
          className="absolute h-[1px]"
          style={{ left: '10%', top: '62%', width: '46%', background: 'rgba(248,113,113,.3)', transformOrigin: 'left center', transform: 'rotate(-40deg)' }}
        />
      </div>
    </div>
  );
}

function RoutingCard() {
  return (
    <div className="rounded-xl p-[13px] px-[15px]" style={{ background: '#1a2b40', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex justify-between text-[10.5px] font-mono-ibm text-[#64748b] mb-[13px] tracking-[.08em] uppercase">
        <span>Network Routing</span>
        <span>4 HOPS DETECTED</span>
      </div>
      <div className="flex items-end pb-0.5">
        {MOCK_DATA.hops.map((h, i) => (
          <div key={h.city} className="flex items-end">
            <div className="text-center flex-1">
              <div className="w-[11px] h-[11px] rounded-full mx-auto mb-1.5" style={{ background: h.color, boxShadow: `0 0 6px ${h.color}` }} />
              <div className="font-mono-ibm text-[10px] font-semibold text-[#f1f5f9]">{h.city}</div>
              <div className="text-[9.5px] text-[#64748b] mt-0.5">{h.role}</div>
            </div>
            {i < MOCK_DATA.hops.length - 1 && (
              <div className="text-[#64748b] text-[13px] pb-4 flex-shrink-0 w-5 text-center">›</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CyberTracingPage({ onBack, onCopy }) {
  const portColor = { safe: '#34d399', warn: '#fbbf24', danger: '#f87171' };
  const portBg = { safe: 'rgba(5,150,105,.12)', warn: 'rgba(217,119,6,.12)', danger: 'rgba(220,38,38,.12)' };
  const portBorder = { safe: 'rgba(5,150,105,.25)', warn: 'rgba(217,119,6,.25)', danger: 'rgba(220,38,38,.25)' };

  return (
    <div className="fade-in min-h-screen" style={{ background: '#0d1b2e' }}>
      <Topbar onBack={onBack} backLabel="กลับ" />

      {/* Cyber sub-bar */}
      <div
        className="px-6 py-2.5 flex items-center justify-between"
        style={{ background: '#0a1520', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-full border-[1.5px] flex items-center justify-center spin-slow"
              style={{ borderColor: '#0891b2' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#0891b2" strokeWidth="2" className="w-[14px] h-[14px]">
                <circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
              </svg>
            </div>
            <div>
              <div className="text-xs font-bold text-[#f1f5f9] font-mono-ibm">RECON ENGINE</div>
              <div className="text-[10px] text-[#64748b]">OSINT · WHOIS · Port Scan</div>
            </div>
          </div>
          <div
            className="breathe text-[10.5px] font-mono-ibm font-bold tracking-[.08em] px-3 py-1 rounded-full text-[#34d399]"
            style={{ background: 'rgba(5,150,105,.12)', border: '1px solid rgba(5,150,105,.3)' }}
          >
            ACTIVE SCAN
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="font-mono-ibm text-[11.5px] font-bold px-3 py-[5px] rounded-[7px]" style={{ background: 'rgba(220,38,38,.1)', border: '1px solid rgba(220,38,38,.3)', color: '#fca5a5' }}>
            THREAT: HIGH
          </div>
          <div className="font-mono-ibm text-[11px] px-3 py-[5px] rounded-[7px] text-[#94a3b8]" style={{ background: '#1e3050', border: '1px solid rgba(255,255,255,0.07)' }}>
            Engines: <strong className="text-[#d97706]">47</strong>
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="grid min-h-[calc(100vh-170px)]" style={{ gridTemplateColumns: '420px 1fr' }}>
        {/* Left panel */}
        <div className="p-[18px] px-5 overflow-y-auto" style={{ borderRight: '1px solid rgba(255,255,255,0.07)' }}>
          <DarkCard label="Suspicious URL / Domain" badge="HIGH RISK">
            <div className="flex items-center gap-2 rounded-lg px-3 py-[9px] mb-2.5" style={{ background: '#0d1b2e' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" className="w-[13px] h-[13px] flex-shrink-0">
                <circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
              </svg>
              <span className="font-mono-ibm text-xs text-[#f87171] flex-1 break-all">{MOCK_DATA.url}</span>
              <button onClick={() => onCopy(MOCK_DATA.url)} className="text-[#64748b] hover:text-[#f1f5f9] text-xs px-1 py-[2px] rounded" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>📋</button>
            </div>
            {/* VirusTotal bar */}
            <div className="mt-1.5">
              <div className="flex justify-between text-[10.5px] font-mono-ibm text-[#64748b] mb-[5px]">
                <span>VirusTotal Score</span>
                <span className="text-[#f87171] font-bold">44/72 Engines</span>
              </div>
              <div className="h-[5px] rounded-[3px] relative" style={{ background: 'linear-gradient(90deg, #22c55e 0%, #f59e0b 55%, #ef4444 100%)' }}>
                <div className="absolute top-[-4px] w-[13px] h-[13px] rounded-full bg-white" style={{ right: '5%', border: '2px solid #ef4444', boxShadow: '0 0 8px rgba(239,68,68,.5)' }} />
              </div>
              <div className="flex justify-between font-mono-ibm text-[10px] text-[#64748b] mt-1">
                <span>Clean</span><span>Suspicious</span><span>Malicious</span>
              </div>
            </div>
          </DarkCard>

          <DarkCard label="WHOIS Registration Data">
            <MetaRow label="Domain" value={MOCK_DATA.domain} color="#f87171" />
            <MetaRow label="Registrar" value={MOCK_DATA.registrar} />
            <MetaRow label="Registered" value={MOCK_DATA.registeredDate} color="#fbbf24" />
            <MetaRow label="Expiry" value={MOCK_DATA.expiryDate} />
            <MetaRow label="Name Servers" value={MOCK_DATA.nameservers} />
            {/* Geo accent */}
            <div className="rounded-[9px] p-[11px] px-[13px] mt-[9px] flex justify-between items-center" style={{ background: 'rgba(217,119,6,.08)', border: '1px solid rgba(217,119,6,.2)' }}>
              <div>
                <div className="text-sm font-bold text-[#d97706]">{MOCK_DATA.country}</div>
                <div className="font-mono-ibm text-[10.5px] text-[#64748b] mt-[3px]">{MOCK_DATA.coords}</div>
              </div>
              <div className="rounded-lg px-3 py-1.5 text-center" style={{ background: 'rgba(220,38,38,.12)', border: '1px solid rgba(220,38,38,.25)' }}>
                <span className="font-mono-ibm text-[20px] font-extrabold text-[#f87171] block">{MOCK_DATA.domainAge}</span>
                <span className="text-[9.5px] font-mono-ibm text-[#f87171] mt-0.5">DAYS OLD</span>
              </div>
            </div>
          </DarkCard>

          <DarkCard label="Open Port Scan">
            <div className="grid grid-cols-2 gap-[7px] mt-2.5">
              {MOCK_DATA.ports.map((p) => (
                <div key={p.num} className="rounded-lg p-2 px-2.5" style={{ background: portBg[p.status], border: `1px solid ${portBorder[p.status]}` }}>
                  <div className="font-mono-ibm text-sm font-bold" style={{ color: portColor[p.status] }}>:{p.num}</div>
                  <div className="text-[10.5px] mt-0.5" style={{ color: `${portColor[p.status]}99` }}>{p.name}</div>
                </div>
              ))}
            </div>
          </DarkCard>
        </div>

        {/* Right panel */}
        <div className="p-[18px] px-5 flex flex-col gap-[14px]">
          <MapCanvas />
          <RoutingCard />

          {/* Conclusion */}
          <div className="rounded-xl p-[14px] px-4" style={{ background: '#1a2b40', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex justify-between items-center mb-3">
              <div>
                <div className="text-[13px] font-bold text-[#f1f5f9]">Recon Conclusion</div>
                <div className="text-[11px] text-[#64748b] mt-0.5">Automated OSINT Summary</div>
              </div>
              <div className="text-[10px] font-mono-ibm font-bold px-[9px] py-[2px] rounded-[5px]" style={{ background: 'rgba(5,150,105,.12)', border: '1px solid rgba(5,150,105,.25)', color: '#34d399' }}>
                94.7% CONFIDENCE
              </div>
            </div>
            <div className="grid grid-cols-2 gap-[7px] mb-[11px]">
              {['Domain จดทะเบียนใหม่มาก (2 วัน)', 'Server ตั้งอยู่ในประเทศรัสเซีย', 'Port 3389 เปิดอยู่ (RDP Backdoor)', 'NameServer ใช้ Cloudflare ซ่อน IP จริง'].map((t, i) => (
                <div key={i} className="rounded-lg p-[9px] px-[11px] text-[11.5px] text-[#94a3b8] leading-[1.45] flex gap-[7px] items-start" style={{ background: '#0d1b2e', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="w-[5px] h-[5px] rounded-full flex-shrink-0 mt-[5px]" style={{ background: i < 2 ? '#34d399' : '#fbbf24' }} />
                  {t}
                </div>
              ))}
            </div>
            <div className="rounded-lg p-[11px] px-[13px] text-xs text-[#94a3b8] leading-[1.65] font-mono-ibm mb-[11px]" style={{ background: 'rgba(0,0,0,.25)', border: '1px solid rgba(255,255,255,0.07)' }}>
              ระบบ OSINT ยืนยันว่า <strong className="text-[#f1f5f9]">scam-bank-verify.com</strong> เป็น <strong className="text-[#f87171]">phishing domain ที่ Active อยู่</strong> — จดโดเมนวันที่ 2024-11-01 ผ่าน bulletproof hosting ในรัสเซีย พบ RDP backdoor เปิดอยู่ แนะนำรายงานต่อ ETDA และ NCSA ทันที
            </div>
            <button
              className="w-full font-bold text-[13px] text-white rounded-[9px] p-[11px] flex items-center justify-center gap-[7px] cursor-pointer transition-all"
              style={{ background: '#2563eb', border: 'none', fontFamily: 'inherit', boxShadow: '0 2px 10px rgba(37,99,235,.35)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#1d4ed8'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#2563eb'; }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[14px] h-[14px]">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export OSINT Report (.pdf)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}