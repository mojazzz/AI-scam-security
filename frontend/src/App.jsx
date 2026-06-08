// frontend/src/App.jsx
import { useState } from 'react';
import InputPanel from './components/InputPanel';
import ResultDashboard from './components/ResultDashboard';

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async (formData) => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        body: formData, // FormData รองรับทั้งข้อความและไฟล์
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center text-sm font-bold">
            🛡️
          </div>
          <div>
            <h1 className="text-lg font-semibold">ScamShield</h1>
            <p className="text-xs text-gray-400">ตรวจจับมิจฉาชีพด้วย AI</p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        <InputPanel onAnalyze={handleAnalyze} loading={loading} />

        {error && (
          <div className="bg-red-950 border border-red-800 rounded-xl p-4 text-red-300 text-sm">
            ⚠️ {error}
          </div>
        )}

        {result && <ResultDashboard result={result} />}
      </main>
    </div>
  );
}