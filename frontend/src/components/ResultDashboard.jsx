// frontend/src/components/ResultDashboard.jsx

const LEVEL_CONFIG = {
  green:   { bg: 'bg-green-950',  border: 'border-green-700',  text: 'text-green-400',  bar: 'bg-green-500' },
  yellow:  { bg: 'bg-yellow-950', border: 'border-yellow-700', text: 'text-yellow-400', bar: 'bg-yellow-500' },
  red:     { bg: 'bg-red-950',    border: 'border-red-700',    text: 'text-red-400',    bar: 'bg-red-500' },
  unknown: { bg: 'bg-gray-900',   border: 'border-gray-700',   text: 'text-gray-400',   bar: 'bg-gray-500' },
};

export default function ResultDashboard({ result }) {
  const { score, level, levelText, indicators, reason, recommendation } = result;
  const cfg = LEVEL_CONFIG[level] || LEVEL_CONFIG.unknown;

  return (
    <div className={`rounded-2xl border ${cfg.bg} ${cfg.border} overflow-hidden`}>
      {/* Score Header */}
      <div className="px-6 py-6 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">คะแนนความเสี่ยง</p>
            <p className={`text-5xl font-bold ${cfg.text}`}>{score}</p>
          </div>
          <div className={`px-5 py-2 rounded-full border ${cfg.border} ${cfg.text} font-semibold text-lg`}>
            {levelText}
          </div>
        </div>

        {/* Risk Bar */}
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-700 ${cfg.bar}`}
            style={{ width: `${score}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>0 ปลอดภัย</span>
          <span>50</span>
          <span>100 อันตราย</span>
        </div>
      </div>

      {/* Details */}
      <div className="px-6 py-5 space-y-5">
        {/* Indicators พบ */}
        {indicators?.length > 0 && (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">สัญญาณที่พบ</p>
            <ul className="space-y-1">
              {indicators.map((item, i) => (
                <li key={i} className={`text-sm flex gap-2 ${cfg.text}`}>
                  <span>⚠️</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* เหตุผล */}
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">เหตุผล</p>
          <p className="text-sm text-gray-200 leading-relaxed">{reason}</p>
        </div>

        {/* คำแนะนำ */}
        <div className={`rounded-xl border p-4 ${cfg.bg} ${cfg.border}`}>
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">คำแนะนำ</p>
          <p className={`text-sm font-medium ${cfg.text} leading-relaxed`}>{recommendation}</p>
        </div>
      </div>
    </div>
  );
}