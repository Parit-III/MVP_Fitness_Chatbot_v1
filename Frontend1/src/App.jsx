import { useState } from "react";
import axios from "axios";

export default function App() {
  const [page, setPage] = useState("form"); // form | chat

  /* ===== FORM STATE ===== */
  const [form, setForm] = useState({
    age: "",
    weight: "",
    height: "",
    goal: "",
    injury: "",
    time: ""
  });

  /* ===== CHAT STATE ===== */
  const [messages, setMessages] = useState([
    { role: "assistant", content: "สวัสดีครับ ผมเป็นเทรนเนอร์ส่วนตัวของคุณ 💪" }
  ]);
  const [input, setInput] = useState("");
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ===== GENERATE PLAN ===== */
  const generatePlan = async () => {
    setLoading(true);

    const res = await axios.post(
      "http://localhost:5000/api/ai/plan",
      form
    );

    setPlan(res.data.plan);

    setMessages([
      {
        role: "assistant",
        content:
          "ผมสร้างแผนให้แล้วครับ 💪 คุณสามารถคุยกับผมต่อหรือปรับตารางได้เลย"
      }
    ]);

    setLoading(false);
    setPage("chat"); // 🚀 MOVE PAGE
  };

  /* ===== SEND CHAT ===== */
  const sendChat = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    const res = await axios.post("http://localhost:5000/api/ai/chat", {
      messages: newMessages,
      currentPlan: plan   // ⭐ สำคัญมาก
    });

    setMessages([
      ...newMessages,
      { role: "assistant", content: res.data.reply }
    ]);
  };

  /* ===== UPDATE PLAN ===== */
  const updatePlan = async () => {
    if (!plan || !input.trim()) return;

    const instruction = input;
    setInput("");

    // ใส่ข้อความ user เข้า chat
    setMessages(prev => [...prev, { role: "user", content: instruction }]);

    const res = await axios.post("http://localhost:5000/api/ai/update-plan", {
      currentPlan: plan,
      instruction
    });

    setPlan(res.data.plan);

    setMessages(prev => [
      ...prev,
      { role: "assistant", content: "Plan updated ✅" }
    ]);
  };



  /* ======================= */
  /* ===== RENDER ========= */
  /* ======================= */

  /* ===== PAGE 1 ===== */
  if (page === "form") {
    return (
      <div style={styles.page}>
        <h2>🧍 Personal Information</h2>

        <div style={styles.form}>
          {Object.keys(form).map(k => (
            <input
              key={k}
              name={k}
              placeholder={k}
              onChange={handleChange}
              style={styles.input}
            />
          ))}
        </div>

        <button onClick={generatePlan} style={styles.primary}>
          {loading ? "Generating..." : "Generate Plan"}
        </button>
      </div>
    );
  }

  /* ===== PAGE 2 ===== */
  return (
    <div style={styles.page}>
      <h2>🏋️ Trainer Chat</h2>

      {/* PLAN */}
      {plan?.days && (
        <table width="100%" border="1">
          <thead>
            <tr>
              <th>Day</th>
              <th>Exercise</th>
              <th>Sets</th>
              <th>Reps</th>
            </tr>
          </thead>
          <tbody>
            {plan.days.map((day, i) =>
              day.exercises.map((ex, j) => (
                <tr key={`${i}-${j}`}>
                  {j === 0 && (
                    <td rowSpan={day.exercises.length}>{day.day}</td>
                  )}
                  <td>{ex.name}</td>
                  <td>{ex.sets}</td>
                  <td>{ex.reps}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}



      {/* CHAT */}
      <div style={styles.chat}>
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.role === "user" ? "right" : "left" }}>
            <span style={styles.bubble(m.role)}>{m.content}</span>
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div style={styles.row}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="ถามเทรนเนอร์..."
          style={styles.msgInput}
        />
        <button onClick={sendChat}>Send</button>
        <button onClick={updatePlan}>Update Plan</button>
      </div>
    </div>
  );
}

/* ===== STYLES ===== */
const styles = {
  page: {
    maxWidth: 600,
    margin: "auto",
    padding: 20,
    fontFamily: "sans-serif"
  },
  form: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginBottom: 20
  },
  input: {
    padding: 10
  },
  primary: {
    padding: 12,
    width: "100%",
    background: "#22c55e",
    border: "none",
    color: "#fff"
  },
  chat: {
    height: 260,
    overflowY: "auto",
    background: "#f3f4f6",
    padding: 10,
    margin: "16px 0"
  },
  bubble: role => ({
    background: role === "user" ? "#22c55e" : "#fff",
    padding: "8px 12px",
    borderRadius: 12,
    display: "inline-block"
  }),
  row: {
    display: "flex",
    gap: 8
  },
  msgInput: {
    flex: 1,
    padding: 10
  }
};
