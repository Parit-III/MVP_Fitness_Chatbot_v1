import { useState } from "react";
import { generatePlan } from "./api";

function App() {
  const [form, setForm] = useState({
    age: "",
    weight: "",
    height: "",
    goal: "",
    injury: "",
    time: ""
  });

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    setLoading(true);
    const res = await generatePlan(form);
    setResult(res.data.plan);
    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🏋️ AI Workout Trainer</h2>

      <input name="age" placeholder="Age" onChange={handleChange} />
      <input name="weight" placeholder="Weight (kg)" onChange={handleChange} />
      <input name="height" placeholder="Height (cm)" onChange={handleChange} />
      <input name="goal" placeholder="Goal" onChange={handleChange} />
      <input name="injury" placeholder="Injury (optional)" onChange={handleChange} />
      <input name="time" placeholder="Minutes/day" onChange={handleChange} />

      <br /><br />
      <button onClick={submit}>
        {loading ? "Generating..." : "Generate Plan"}
      </button>

      <pre style={{ marginTop: 20, whiteSpace: "pre-wrap" }}>
        {result}
      </pre>
    </div>
  );
}

export default App;
