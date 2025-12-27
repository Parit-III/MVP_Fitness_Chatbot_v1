import { useState } from "react";
import { getWorkoutPlan } from "./api";

function App() {
  const [form, setForm] = useState({
    age: "",
    weight: "",
    height: "",
    goal: "",
    injury: "",
    time: ""
  });

  const [plan, setPlan] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    const res = await getWorkoutPlan(form);
    setPlan(res.data.plan);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>AI Workout Trainer 💪</h2>

      <input name="age" placeholder="Age" onChange={handleChange} />
      <input name="weight" placeholder="Weight" onChange={handleChange} />
      <input name="height" placeholder="Height" onChange={handleChange} />
      <input name="goal" placeholder="Goal" onChange={handleChange} />
      <input name="injury" placeholder="Injury (optional)" onChange={handleChange} />
      <input name="time" placeholder="Minutes/day" onChange={handleChange} />

      <br /><br />
      <button onClick={submit}>Generate Plan</button>

      <pre style={{ marginTop: 20 }}>{plan}</pre>
    </div>
  );
}

export default App;
