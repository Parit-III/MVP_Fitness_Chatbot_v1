import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/plan", async (req, res) => {
  const { age, weight, height, goal, injury, time } = req.body;

  const prompt = `
คุณเป็น Personal Trainer มืออาชีพ
ข้อมูลผู้ใช้:
- อายุ ${age}
- น้ำหนัก ${weight} kg
- ส่วนสูง ${height} cm
- เป้าหมาย ${goal}
- อาการบาดเจ็บ ${injury || "ไม่มี"}
- เวลาว่าง ${time} นาที/วัน

กรุณาวางแผนออกกำลังกาย 5 วัน
ตอบเป็นตาราง
`;

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent",
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      {
        params: { key: process.env.GEMINI_API_KEY }
      }
    );

    const plan =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No result";

    res.json({ plan });

  } catch (err) {
    console.error("Gemini error:", err.response?.data || err.message);
    res.status(500).json({ error: "Gemini API error" });
  }
});

export default router;
