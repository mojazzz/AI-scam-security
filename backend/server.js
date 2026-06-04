require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// ตั้งค่าการอัปโหลดไฟล์ด้วย Multer
const upload = multer({ dest: 'uploads/' });

// กำหนดค่า AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Endpoint สำหรับวิเคราะห์ข้อความและลิงก์
app.post('/api/analyze-text', async (req, res) => {
    try {
        const { text } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // System Prompt สั่งให้ AI ตอบเป็น JSON เสมอ
        const prompt = `
        คุณคือผู้เชี่ยวชาญด้านความปลอดภัยไซเบอร์ วิเคราะห์ข้อความหรือลิงก์ต่อไปนี้ว่าเป็นมิจฉาชีพหรือไม่ 
        ข้อมูล: "${text}"
        ตอบกลับเป็น JSON format เท่านั้น โดยมี key ดังนี้:
        {
            "score": (คะแนนความเสี่ยง 0-100),
            "level": ("green", "yellow", หรือ "red"),
            "reason": (เหตุผลสั้นๆ),
            "recommendation": (คำแนะนำ)
        }`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let textResponse = response.text();

        // Clean up JSON string (เผื่อ AI ใส่ markdown ```json มาให้)
        textResponse = textResponse.replace(/```json|```/g, '');

        res.json(JSON.parse(textResponse));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการวิเคราะห์" });
    }
});

app.post('/api/analyze-file', upload.single('file'), async (req, res) => {
    try {
        // เช็คว่ามีไฟล์ส่งมาไหม
        if (!req.file) {
            return res.status(400).json({ error: "ไม่พบไฟล์ที่อัปโหลด" });
        }

        const file = req.file;
        const mimeType = file.mimetype;

        // อ่านไฟล์ชั่วคราวที่ multer รับมา แล้วแปลงเป็น Base64
        const fileData = fs.readFileSync(file.path).toString("base64");

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // System Prompt สำหรับไฟล์
        const prompt = `
        คุณคือผู้เชี่ยวชาญด้านความปลอดภัยไซเบอร์ วิเคราะห์ข้อมูลจากไฟล์แนบนี้ (อาจเป็นรูปภาพสกรีนช็อตข้อความหลอกลวง, ลิงก์, สลิปโอนเงิน, หรือคลิปเสียงสนทนา) ว่าเข้าข่ายมิจฉาชีพหรือไม่
        ตอบกลับเป็น JSON format เท่านั้น โดยมี key ดังนี้:
        {
            "score": (คะแนนความเสี่ยง 0-100),
            "level": ("green", "yellow", หรือ "red"),
            "reason": (เหตุผลสั้นๆ ชัดเจน),
            "recommendation": (คำแนะนำที่ควรทำ)
        }`;

        // จัดเตรียมข้อมูลไฟล์เพื่อส่งให้ Gemini
        const filePart = {
            inlineData: {
                data: fileData,
                mimeType: mimeType
            }
        };

        // ส่ง Prompt พร้อมไฟล์
        const result = await model.generateContent([prompt, filePart]);
        const response = await result.response;
        let textResponse = response.text();
        
        // ลบไฟล์ชั่วคราวทิ้งทันทีเพื่อไม่ให้เซิร์ฟเวอร์รก
        fs.unlinkSync(file.path);

        // คลีน JSON คืนค่าให้ Frontend
        textResponse = textResponse.replace(/```json|```/g, '');
        res.json(JSON.parse(textResponse));

    } catch (error) {
        console.error(error);
        // หากเกิด Error ก็ต้องลบไฟล์ทิ้งด้วย
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการวิเคราะห์ไฟล์" });
    }
});

app.listen(process.env.PORT || 5000, () => {
    console.log("Backend running on port 5000");
});