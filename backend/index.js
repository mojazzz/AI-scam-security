// backend/index.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import dotenv from 'dotenv';
import analyzeRouter from './routes/analyze.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173'];

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '1mb' }));

// จำกัด 20 req/นาที ต่อ IP — ป้องกัน Gemini quota หมด
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: 'คุณส่งคำขอมากเกินไป กรุณารอสักครู่' },
});
app.use('/api', limiter);
app.use('/api', analyzeRouter);

app.listen(PORT, () => console.log(`✅ Backend on http://localhost:${PORT}`));