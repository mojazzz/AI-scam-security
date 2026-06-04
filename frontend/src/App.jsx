import { useState } from 'react';

function App() {
  const [inputData, setInputData] = useState('');
  const [file, setFile] = useState(null); // State สำหรับเก็บไฟล์ที่อัปโหลด
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // ฟังก์ชันจัดการเมื่อเลือกไฟล์
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      // เคลียร์ช่องข้อความออกเพื่อไม่ให้สับสนว่ากำลังส่งอะไร
      setInputData(''); 
    }
  };

  const handleAnalyze = async () => {
    if (!inputData.trim() && !file) return;
    
    setLoading(true);
    setResult(null); // เคลียร์ผลลัพธ์เก่าก่อน

    try {
      let response;

      if (file) {
        // กรณีส่งเป็นไฟล์ (รูปภาพ หรือ เสียง)
        const formData = new FormData();
        formData.append('file', file);
        
        response = await fetch('http://localhost:5000/api/analyze-file', {
          method: 'POST',
          // ข้อควรระวัง: เมื่อใช้ FormData ห้ามเซ็ต Content-Type เอง เดี๋ยว Browser จะจัดการให้
          body: formData
        });
      } else {
        // กรณีส่งเป็นข้อความปกติ
        response = await fetch('http://localhost:5000/api/analyze-text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: inputData })
        });
      }
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    }
    setLoading(false);
  };

  const getLevelColor = (level) => {
    if (level === 'red') return 'bg-red-50 border-red-500 text-red-700';
    if (level === 'yellow') return 'bg-yellow-50 border-yellow-500 text-yellow-700';
    return 'bg-green-50 border-green-500 text-green-700';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Anti-Scam AI 🛡️</h1>
        
        {/* ส่วนรับข้อความ */}
        <div className="mb-4">
          <textarea 
            className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows="4"
            placeholder="วางข้อความ, SMS, หรือ ลิงก์ที่น่าสงสัยที่นี่..."
            value={inputData}
            onChange={(e) => {
              setInputData(e.target.value);
              setFile(null); // ถ้าพิมพ์ข้อความ ให้เคลียร์ไฟล์ทิ้ง
            }}
          ></textarea>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-sm text-gray-400 font-medium">หรือ</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* ส่วนรับไฟล์ (รูปภาพ / เสียง) */}
        <div className="mb-6">
          <label className="block w-full cursor-pointer bg-gray-50 border-2 border-dashed border-gray-300 hover:border-blue-500 p-4 rounded-lg text-center transition-colors">
            <span className="text-gray-600 font-medium">
              {file ? `ไฟล์ที่เลือก: ${file.name}` : '📁 คลิกเพื่ออัปโหลดรูปภาพ หรือ ไฟล์เสียง'}
            </span>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*, audio/*" 
              onChange={handleFileChange}
            />
          </label>
        </div>
        
        <button 
          onClick={handleAnalyze}
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
          disabled={loading || (!inputData && !file)}
        >
          {loading ? 'กำลังให้ AI ตรวจสอบ...' : 'ตรวจสอบความเสี่ยง'}
        </button>

        {/* ส่วนแสดงผลลัพธ์ */}
        {result && (
          <div className={`mt-8 p-6 border-l-4 rounded-lg ${getLevelColor(result.level)}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">ระดับความเสี่ยง: {result.level.toUpperCase()}</h2>
              <span className="text-xl font-bold bg-white px-3 py-1 rounded-full shadow-sm">
                คะแนน {result.score}/100
              </span>
            </div>
            <div className="space-y-3">
              <p><strong>เหตุผลการประเมิน:</strong> {result.reason}</p>
              <p><strong>ข้อแนะนำ:</strong> {result.recommendation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;