// frontend/src/App.jsx
import { useState } from 'react';
import InputPage from './components/InputPage';
import ResultPage from './components/ResultPage';
import CyberTracingPage from './components/CyberTracingPage';
import ThreatIntelPage from './components/ThreatIntelPage';
import LoadingOverlay from './components/LoadingOverlay';
import Toast from './components/Toast';

export default function App() {
  const [page, setPage] = useState('input');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [inputText, setInputText] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  };

  const handleAnalyze = async (formData, textValue) => {
    setLoading(true);
    setError('');
    setResult(null);
    setInputText(textValue || '');

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/analyze`,
        { method: 'POST', body: formData }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'เกิดข้อผิดพลาด');
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

  return (
    <div className="min-h-screen" style={{ fontFamily: "'DM Sans','IBM Plex Sans Thai',sans-serif" }}>
      {loading && <LoadingOverlay />}
      {toast && <Toast message={toast} />}

      {page === 'input' && (
        <InputPage onAnalyze={handleAnalyze} error={error} />
      )}
      {page === 'result' && (
        <ResultPage
          result={result}
          onBack={() => goTo('input')}
          onGoCyber={() => goTo('cyber')}
          onGoIntel={() => goTo('intel')}
          onCopy={(txt) => { navigator.clipboard.writeText(txt).catch(() => {}); showToast('คัดลอกแล้ว'); }}
        />
      )}
      {page === 'cyber' && (
        <CyberTracingPage onBack={() => goTo('result')} onCopy={(txt) => { navigator.clipboard.writeText(txt).catch(() => {}); showToast('คัดลอกแล้ว'); }} />
      )}
      {page === 'intel' && (
        <ThreatIntelPage onBack={() => goTo('result')} />
      )}
    </div>
  );
}