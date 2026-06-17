// frontend/src/components/Toast.jsx
export default function Toast({ message }) {
  return (
    <div
      className="fixed bottom-5 right-5 text-white text-[12.5px] font-mono-ibm px-4 py-2 rounded-lg z-[300] pointer-events-none"
      style={{ background: '#059669', opacity: 1, transition: 'opacity .3s' }}
    >
      {message}
    </div>
  );
}