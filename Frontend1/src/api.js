import axios from "axios";

const API = axios.create({
  baseURL: "https://mvp-fitness-chatbot-v1-zx18.onrender.com/api"
});

export default API;
