// backend/routes/analyze.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import { analyzeWithGemini } from '../services/geminiService.js';

const router = express.Router();

// ตั้งค่า Multer เก็บไฟล์ชั่วคราว
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'audio/mpeg', 'audio/wav', 'audio/mp4'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('ประเภทไฟล์ไม่รองรับ'), false);
  },
});

// POST /api/analyze
router.post('/analyze', upload.single('file'), async (req, res) => {
  try {
    const { text, url, inputType } = req.body;
    const file = req.file;

    // ตรวจสอบว่ามีข้อมูลส่งมา
    if (!text && !url && !file) {
      return res.status(400).json({ error: 'กรุณาระบุข้อมูลที่ต้องการตรวจสอบ' });
    }

    // ส่งไปวิเคราะห์
    const result = await analyzeWithGemini({ text, url, file, inputType });

    res.json(result);
  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;