// frontend/src/App.jsx
import { useState } from 'react';
import InputPage from './components/InputPage';
import ResultPage from './components/ResultPage';
import LoadingOverlay from './components/LoadingOverlay';
import Toast from './components/Toast';

export default function App() {
  const [page, setPage] = useState('input');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  };

  const handleAnalyze = async (formData) => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/analyze`,
        { method: 'POST', body: formData }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      }

      const data = await res.json();
      setResult(data);
      setPage('result');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const goTo = (p) => {
    setPage(p);
    window.scrollTo(0, 0);
  };

  const handleCopy = (txt) => {
    navigator.clipboard.writeText(txt).catch(() => {});
    showToast('คัดลอกแล้ว');
  };

  return (
    <div style={{ fontFamily: "'DM Sans','IBM Plex Sans Thai',sans-serif" }}>
      {loading && <LoadingOverlay />}
      {toast && <Toast message={toast} />}

      {page === 'input' && (
        <InputPage onAnalyze={handleAnalyze} error={error} />
      )}
      {page === 'result' && (
        <ResultPage
          result={result}
          onBack={() => goTo('input')}
          onCopy={handleCopy}
        />
      )}
    </div>
  );
}