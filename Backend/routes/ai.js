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
ใช้ภาษาไทย
  `;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "คุณเป็นผู้เชี่ยวชาญด้านการออกกำลังกาย" },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 800
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const plan =
      response.data.choices?.[0]?.message?.content || "No result";

    res.json({ plan });

  } catch (err) {
    console.error("Groq error:", err.response?.data || err.message);
    res.status(500).json({ error: "Groq API error" });
  }
});

export default router;
