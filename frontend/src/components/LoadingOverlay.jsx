// frontend/src/components/LoadingOverlay.jsx
export default function LoadingOverlay() {
  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-[18px]"
      style={{ background: 'rgba(10,20,34,.92)' }}
    >
      <div
        className="w-[52px] h-[52px] rounded-full border-[3px] border-[#1e3050] border-t-[#2563eb]"
        style={{ animation: 'spin .8s linear infinite' }}
      />
      <div className="font-mono-ibm text-[#f1f5f9] text-[13.5px]">AI Engine กำลังวิเคราะห์</div>
      <div className="font-mono-ibm text-[#64748b] text-[11.5px]">3-Agent Pipeline · Thai NLP · &lt; 4s</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}