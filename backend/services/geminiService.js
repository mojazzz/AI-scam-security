// backend/services/geminiService.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// ====== SYSTEM PROMPT: 3-Agent Chain of Thought ======
const buildPrompt = (inputText, inputType) => `
คุณคือระบบตรวจจับมิจฉาชีพ ScamShield ทำงานแบบ 3 ขั้นตอน ห้ามข้ามขั้นตอน

## [AGENT 1: EXTRACTOR]
สกัดข้อมูลดิบออกมาให้ครบ อย่าคิดหรือวิเคราะห์:
- ถ้าเป็นข้อความ: คัดลอกข้อความที่เกี่ยวข้องทั้งหมด
- ถ้าเป็น URL: ระบุ domain, subdomain, path ทุกส่วน
- ถ้าเป็นรูปภาพ/เสียง: ถอดข้อความที่อ่าน/ได้ยินมาทั้งหมด
ห้ามเติมแต่งหรือตีความ

## [AGENT 2: THREAT ANALYST]
วิเคราะห์จากข้อมูลของ Agent 1 เท่านั้น หา Indicators of Compromise (IoC):
- การใช้คำเร่งด่วน/ข่มขู่ (เช่น "ด่วนมาก", "บัญชีถูกระงับ")
- URL ผิดปกติ (typosquatting, subdomain แปลก, non-https)
- ขอข้อมูลส่วนตัว/รหัสผ่าน/OTP
- ขอให้โอนเงิน/กดลิงก์/ติดตั้งแอป
- อ้างองค์กรราชการ/ธนาคาร/บริษัทใหญ่
ระบุ IoC แต่ละข้อพร้อมหลักฐาน

## [AGENT 3: EVALUATOR]
คำนวณคะแนนและส่งออก JSON เท่านั้น ห้ามเพิ่มข้อความอื่น:
- ถ้าข้อมูลไม่เพียงพอ → score: 0, level: "unknown"
- คะแนน 0-30 = ปลอดภัย (green)
- คะแนน 31-70 = ระมัดระวัง (yellow)
- คะแนน 71-100 = อันตราย (red)

ส่งออก JSON format นี้เท่านั้น:
{
  "score": <0-100>,
  "level": "<green|yellow|red|unknown>",
  "levelText": "<ปลอดภัย|ระมัดระวัง|อันตราย|ข้อมูลไม่เพียงพอ>",
  "indicators": ["IoC ที่พบ 1", "IoC ที่พบ 2"],
  "reason": "อธิบายสั้นๆ ว่าทำไมถึงให้คะแนนนี้",
  "recommendation": "คำแนะนำที่ชัดเจนว่าควรทำอะไร"
}

---
ประเภทข้อมูล: ${inputType}
ข้อมูลที่ต้องวิเคราะห์:
${inputText}
`;

// ====== ฟังก์ชันหลัก + Retry Logic ======
export async function analyzeWithGemini({ text, url, file, inputType }) {
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      let parts = [];
      let userInput = '';

      if (text) userInput = `ข้อความ: ${text}`;
      if (url)  userInput = `URL: ${url}`;

      if (file) {
        const fileData = fs.readFileSync(file.path);
        const base64   = fileData.toString('base64');
        const mimeType = file.mimetype;

        parts.push({ inlineData: { data: base64, mimeType } });

        userInput = inputType === 'audio'
          ? 'นี่คือไฟล์เสียง กรุณาถอดข้อความและวิเคราะห์'
          : 'นี่คือรูปภาพ กรุณาอ่านข้อความในภาพและวิเคราะห์';

        fs.unlinkSync(file.path);
      }

      parts.push({ text: buildPrompt(userInput, inputType || 'text') });

      const result = await model.generateContent({
        contents: [{ role: 'user', parts }]
      });

      const responseText = result.response.text();

      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('AI ไม่ส่งข้อมูล JSON กลับมา');

      return JSON.parse(jsonMatch[0]);

    } catch (err) {
      console.log(`❌ Attempt ${attempt}/${maxRetries}:`, err.message);

      // ถ้าเป็น 503 และยังมี retry เหลือ → รอแล้วลองใหม่
      if (err.message.includes('503') && attempt < maxRetries) {
        const wait = attempt * 2000; // รอ 2s → 4s → 6s
        console.log(`⏳ รอ ${wait / 1000} วิ แล้วลองใหม่...`);
        await new Promise(res => setTimeout(res, wait));
        continue;
      }

      throw new Error('ไม่สามารถวิเคราะห์ได้: ' + err.message);
    }
  }
}