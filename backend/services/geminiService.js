// backend/services/geminiService.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

// ถอดเสียงด้วย Hugging Face Inference API (ฟรี ไม่จำกัด)
async function transcribeWithHuggingFace(fileBuffer, mimetype) {
  const HF_TOKEN = process.env.HF_API_KEY;

  const res = await fetch(
    'https://api-inference.huggingface.co/models/openai/whisper-large-v3',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        'Content-Type': mimetype,
      },
      body: fileBuffer,
    }
  );

  if (!res.ok) {
    const err = await res.text();
    // Model กำลัง load (cold start) — รอแล้วลองใหม่
    if (res.status === 503) throw new Error('MODEL_LOADING');
    throw new Error(`Hugging Face error: ${err}`);
  }

  const data = await res.json();
  return data.text || '';
}

const buildPrompt = (inputText, inputType, urlSafetyResult) => {
  // ถ้า Safe Browsing ยืนยันว่าอันตราย ให้บอก Gemini ด้วย
  const safeBrowsingNote = urlSafetyResult?.isMalicious
    ? `\n[หมายเหตุ: Google Safe Browsing ตรวจพบว่า URL นี้เป็นอันตราย ประเภท: ${urlSafetyResult.threats.join(', ')}]`
    : '';

  return `
คุณคือระบบตรวจจับมิจฉาชีพ ScamShield ทำงานแบบ 3 ขั้นตอน ห้ามข้ามขั้นตอน

## [AGENT 1: EXTRACTOR]
สกัดข้อมูลดิบออกมาให้ครบ อย่าคิดหรือวิเคราะห์:
- ถ้าเป็นข้อความ: คัดลอกข้อความที่เกี่ยวข้องทั้งหมด
- ถ้าเป็น URL: ระบุ domain, subdomain, path ทุกส่วน
- ถ้าเป็นรูปภาพ/เสียง: ถอดข้อความที่อ่าน/ได้ยินมาทั้งหมด
ห้ามเติมแต่งหรือตีความ

## [AGENT 2: THREAT ANALYST]
วิเคราะห์จากข้อมูลของ Agent 1 เท่านั้น หา Indicators of Compromise (IoC):
- การใช้คำเร่งด่วน/ข่มขู่
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
ประเภทข้อมูล: ${inputType}${safeBrowsingNote}
ข้อมูลที่ต้องวิเคราะห์:
${inputText}
`;
};

export async function analyzeWithGemini({ text, url, file, inputType, urlSafetyResult }) {
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      let parts = [];
      let userInput = '';

      if (text) userInput = `ข้อความ: ${text}`;
      if (url)  userInput = `URL: ${url}`;

      if (file) {
        if (inputType === 'audio') {
          // Hugging Face Whisper — ฟรี ไม่จำกัด
          let transcript = '';
          for (let t = 1; t <= 3; t++) {
            try {
              transcript = await transcribeWithHuggingFace(file.buffer, file.mimetype);
              break;
            } catch (e) {
              if (e.message === 'MODEL_LOADING' && t < 3) {
                // Model กำลัง warm up รอ 20 วินาที (cold start ปกติ)
                console.log(`⏳ Whisper model loading... รอ 20s (attempt ${t}/3)`);
                await new Promise(r => setTimeout(r, 20000));
              } else throw e;
            }
          }
          if (!transcript.trim()) throw new Error('ไม่สามารถถอดความเสียงได้');
          userInput = `ข้อความที่ถอดจากเสียง: ${transcript}`;
        } else {
          // รูปภาพ — ส่งตรงไป Gemini ได้เลย
          const base64 = file.buffer.toString('base64');
          parts.push({ inlineData: { data: base64, mimeType: file.mimetype } });
          userInput = 'นี่คือรูปภาพ กรุณาอ่านข้อความในภาพและวิเคราะห์';
        }
      }

      parts.push({ text: buildPrompt(userInput, inputType || 'text', urlSafetyResult) });

      const result = await model.generateContent({
        contents: [{ role: 'user', parts }],
      });

      const responseText = result.response.text();
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('AI ไม่ส่งข้อมูล JSON กลับมา');

      const parsed = JSON.parse(jsonMatch[0]);

      // ถ้า Safe Browsing ยืนยันว่าอันตราย → บังคับ score ขั้นต่ำ 80
      if (urlSafetyResult?.isMalicious && parsed.score < 80) {
        parsed.score = 85;
        parsed.level = 'red';
        parsed.levelText = 'อันตราย';
        parsed.indicators = [
          `Google Safe Browsing: ${urlSafetyResult.threats.join(', ')}`,
          ...(parsed.indicators || []),
        ];
      }

      return parsed;

    } catch (err) {
      console.log(`❌ Attempt ${attempt}/${maxRetries}:`, err.message);

      if ((err.message.includes('503') || err.message.includes('429')) && attempt < maxRetries) {
        const wait = attempt * 2000;
        console.log(`⏳ รอ ${wait / 1000}s แล้วลองใหม่...`);
        await new Promise(r => setTimeout(r, wait));
        continue;
      }

      throw new Error('ไม่สามารถวิเคราะห์ได้: ' + err.message);
    }
  }
}