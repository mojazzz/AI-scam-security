// backend/routes/analyze.js
import express from 'express';
import multer from 'multer';
import { analyzeWithGemini } from '../services/geminiService.js';
import { checkUrlSafety } from '../services/safeBrowsingService.js';

const router = express.Router();

// memoryStorage — ไม่เขียนไฟล์ลง disk เลย
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      'image/jpeg', 'image/png', 'image/webp',
      'audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/webm',
    ];
    allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('ประเภทไฟล์ไม่รองรับ'));
  },
});

function validateUrl(raw) {
  try {
    const url = new URL(raw);
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('รองรับเฉพาะ http/https');
    }
    return url.href;
  } catch {
    throw new Error('URL ไม่ถูกต้อง');
  }
}

router.post('/analyze', upload.single('file'), async (req, res) => {
  try {
    let { text, url, inputType } = req.body;
    const file = req.file;

    if (!text && !url && !file) {
      return res.status(400).json({ error: 'กรุณาระบุข้อมูลที่ต้องการตรวจสอบ' });
    }

    if (text) text = text.trim().slice(0, 5000);

    // ตรวจ URL ด้วย Safe Browsing ก่อนส่ง Gemini
    let urlSafetyResult = null;
    if (url) {
      url = validateUrl(url);
      urlSafetyResult = await checkUrlSafety(url);
    }

    const result = await analyzeWithGemini({ text, url, file, inputType, urlSafetyResult });
    res.json(result);
  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;