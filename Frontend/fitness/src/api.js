import axios from "axios";

export const getWorkoutPlan = (data) => {
  return axios.post("http://localhost:5000/api/ai/plan", data);
};
