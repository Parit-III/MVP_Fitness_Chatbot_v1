import axios from "axios";

const API = axios.create({
  baseURL: "https://fitness-ai-backend.onrender.com/api"
});

export default API;
