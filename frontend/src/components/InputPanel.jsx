// frontend/src/components/InputPanel.jsx
import { useState, useRef } from 'react';

const INPUT_TYPES = [
  { id: 'text', label: '💬 ข้อความ', placeholder: 'วางข้อความ SMS, LINE หรืออีเมลที่สงสัย...' },
  { id: 'url',  label: '🔗 ลิงก์',   placeholder: 'https://example.com/suspicious-link' },
  { id: 'image', label: '🖼️ รูปภาพ', placeholder: null },
  { id: 'audio', label: '🎙️ เสียง',  placeholder: null },
];

export default function InputPanel({ onAnalyze, loading }) {
  const [activeType, setActiveType] = useState('text');
  const [textValue, setTextValue] = useState('');
  const [file, setFile] = useState(null);
  const fileRef = useRef();

  const handleSubmit = () => {
    const fd = new FormData();
    fd.append('inputType', activeType);

    if (activeType === 'text') fd.append('text', textValue);
    else if (activeType === 'url') fd.append('url', textValue);
    else if (file) fd.append('file', file);
    else return;

    onAnalyze(fd);
  };

  const activeConfig = INPUT_TYPES.find(t => t.id === activeType);

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      {/* Tab switcher */}
      <div className="flex border-b border-gray-800">
        {INPUT_TYPES.map(type => (
          <button
            key={type.id}
            onClick={() => { setActiveType(type.id); setTextValue(''); setFile(null); }}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeType === type.id
                ? 'bg-gray-800 text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div className="p-6 space-y-4">
        {(activeType === 'text' || activeType === 'url') && (
          <textarea
            value={textValue}
            onChange={e => setTextValue(e.target.value)}
            placeholder={activeConfig.placeholder}
            rows={activeType === 'text' ? 5 : 2}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
          />
        )}

        {(activeType === 'image' || activeType === 'audio') && (
          <div
            onClick={() => fileRef.current.click()}
            className="border-2 border-dashed border-gray-700 rounded-xl p-10 text-center cursor-pointer hover:border-gray-500 transition-colors"
          >
            <p className="text-gray-400 text-sm">
              {file ? `✅ ${file.name}` : `คลิกเพื่ออัปโหลด${activeType === 'image' ? 'รูปภาพ (สูงสุด 5MB)' : 'ไฟล์เสียง (สูงสุด 2 นาที)'}`}
            </p>
            <input
              ref={fileRef}
              type="file"
              accept={activeType === 'image' ? 'image/*' : 'audio/*'}
              className="hidden"
              onChange={e => setFile(e.target.files[0])}
            />
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || (!textValue && !file)}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {loading ? '🔍 กำลังวิเคราะห์...' : '🛡️ ตรวจสอบเดี๋ยวนี้'}
        </button>
      </div>
    </div>
  );
}