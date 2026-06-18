import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

// เรียกใช้งานด้วย API Key เดิมของคุณ
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🌟 เปลี่ยนมาใช้งานโมเดลฟรีเวอร์ชันล่าสุดตามที่มีใน Google AI Studio ของคุณ
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

/**
 * ฟังก์ชันสร้าง Prompt ให้กับ AI ทำงานแยกแยะแบบ Agent ตามโครงสร้างระบบเดิมของคุณ
 */
const buildPrompt = (userInput, inputType, urlSafetyResult) => {
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
${userInput}
`;
};

/**
 * ฟังก์ชันหลักในการวิเคราะห์ข้อมูล รองรับ Text, URL, Image และ Audio แบบ Multimodal
 */
export async function analyzeWithGemini({ text, url, file, inputType, urlSafetyResult }) {
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      let parts = [];
      let userInput = '';

      if (text) userInput = `ข้อความ: ${text}`;
      if (url)  userInput = `URL: ${url}`;

      // 🛠️ การจัดการข้อมูลประเภทไฟล์ (รูปภาพ หรือ เสียง) ส่งตรงหา Gemini 3.5 Flash
      if (file) {
        // แปลง Buffer ของไฟล์ดิบให้อยู่ในรูปแบบ Base64 string ตามที่คู่มือ Gemini กำหนด
        const base64Data = file.buffer.toString('base64');
        
        parts.push({
          inlineData: {
            data: base64Data,
            mimeType: file.mimetype // ส่งประเภทไฟล์ เช่น audio/mp3 หรือ image/png
          }
        });

        // กำหนดคำสั่งเบื้องต้นให้ AI ทราบหน้าที่ตามประเภทสื่อที่ส่งไป
        if (inputType === 'audio') {
          userInput = 'นี่คือไฟล์เสียง กรุณาฟังเนื้อหาทั้งหมดอย่างละเอียด แล้วนำไปวิเคราะห์หาความเสี่ยงมิจฉาชีพ';
        } else {
          userInput = 'นี่คือรูปภาพ กรุณาอ่านและถอดข้อความในภาพทั้งหมด แล้วนำไปวิเคราะห์หาความเสี่ยงมิจฉาชีพ';
        }
      }

      // แนบส่วนของ Prompt หลักเข้าไปในชุดข้อมูลที่ต้องการส่ง
      parts.push({ text: buildPrompt(userInput, inputType || 'text', urlSafetyResult) });

      // ส่งชุดข้อมูล (Multimodal) ไปประมวลผลที่เซิร์ฟเวอร์ Google
      const result = await model.generateContent({
        contents: [{ role: 'user', parts }],
      });

      const responseText = result.response.text();
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('AI ไม่ส่งข้อมูลโครงสร้าง JSON กลับมา');

      const parsed = JSON.parse(jsonMatch[0]);

      // ตรวจสอบความปลอดภัยเพิ่มเติมร่วมกับสิทธิ์ URL
      if (urlSafetyResult?.isMalicious && parsed.score < 80) {
        parsed.score = 85;
        parsed.level = 'red';
        parsed.levelText = 'อันตราย';
        parsed.indicators = [
          `Google Safe Browsing 检测: ${urlSafetyResult.threats.join(', ')}`,
          ...(parsed.indicators || []),
        ];
      }

      return parsed;

    } catch (err) {
      console.log(`❌ Attempt ${attempt}/${maxRetries}:`, err.message);

      // กรณีเจอปัญหา Overload หรือ Rate Limit ชั่วคราว ให้รอและลองใหม่
      if ((err.message.includes('503') || err.message.includes('429')) && attempt < maxRetries) {
        const wait = attempt * 2000;
        console.log(`⏳ กำลังรอระบบว่าง ${wait / 1000} วินาที...`);
        await new Promise(r => setTimeout(r, wait));
        continue;
      }

      throw new Error('ไม่สามารถวิเคราะห์ได้: ' + err.message);
    }
  }
}