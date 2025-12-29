import express from "express";
import axios from "axios";

const router = express.Router();
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant";

const groq = async (messages, max_tokens = 900) => {
  const res = await axios.post(
    GROQ_URL,
    {
      model: MODEL,
      messages,
      temperature: 0.7,
      max_tokens
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  return res.data.choices[0].message.content;
};

/* ========================= */
/* ===== GENERATE PLAN ===== */
/* ========================= */
router.post("/plan", async (req, res) => {
  const { age, weight, height, goal, injury, time } = req.body;

  const prompt = `
You are a professional personal trainer.
You are creating a workout plan (5 days Monday-Friday).
STRICT RULES:
- Make a workout plan that suit user need
- Match exercises to the user's goal
- If user wants to avoid a body part, replace with other muscle groups or cardio
- Return ONLY valid JSON (Very Important)
- English only
- No explanation text

ข้อมูลผู้ใช้:
- อายุ: ${age}
- น้ำหนัก: ${weight} kg
- ส่วนสูง: ${height} cm
- เป้าหมาย: ${goal}
- อาการบาดเจ็บ: ${injury || "ไม่มี"}
- เวลาว่าง: ${time} นาที/วัน

รูปแบบ JSON:
{
  "days": [
    {
      "day": "Day 1",
      "exercises": [
        { "name": "Squat", "sets": 3, "reps": 12 }
      ]
    }
  ]
}
`;

  try {
    let content = await groq([
  { role: "system", content: "คุณเป็นเทรนเนอร์ฟิตเนสระดับมืออาชีพ" },
  { role: "user", content: prompt }
]);

// 🔥 กัน AI ตอบนอก JSON
content = content.replace(/```json|```/g, "").trim();

console.log("AI RAW:", content); // 👈 สำคัญ

const plan = JSON.parse(content);
res.json({ plan });


  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Plan generation failed" });
  }
});

/* ===================== */
/* ===== CHAT ======== */
/* ===================== */
router.post("/chat", async (req, res) => {
  const { messages, currentPlan } = req.body;

  const reply = await groq([
    {
      role: "system",
      content: `
You are a personal trainer.
User already has this workout plan:
${currentPlan ? JSON.stringify(currentPlan) : "No plan yet"}

Reply with text only.
`
    },
    ...messages
  ], 300);

  res.json({ reply });
});



/* ========================= */
/* ===== UPDATE PLAN ======= */
/* ========================= */
router.post("/update-plan", async (req, res) => {
  const { currentPlan, instruction } = req.body;

  const prompt = `
You are updating a workout plan.
You are a professional personal trainer.
STRICT RULES:
- Never remove all exercises from a day
- If an exercise is removed, REPLACE it with a suitable alternative
- Keep at least 2–4 exercises per day
- Match replacement exercises to the user's goal
- If user wants to avoid a body part, replace with other muscle groups or cardio
- Return ONLY valid JSON
- Same structure as input
- English only
- No explanation text

CURRENT PLAN:
${JSON.stringify(currentPlan)}

USER REQUEST:
"${instruction}"

OUTPUT FORMAT EXACTLY:
{
  "days": [
    {
      "day": "Day 1",
      "exercises": [
        { "name": "Exercise", "sets": 3, "reps": 12 }
      ]
    }
  ]
}
`;

  try {
    const content = await groq([
      { role: "system", content: "Workout plan editor (JSON only)" },
      { role: "user", content: prompt }
    ]);

    const plan = JSON.parse(content);
    res.json({ plan });
  } catch (err) {
    console.error("UPDATE ERROR:", err.message);
    res.status(500).json({ error: "Update failed" });
  }
});


export default router;
