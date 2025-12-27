import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import aiRoute from "./routes/ai.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173", // frontend
  credentials: true
}));

app.use(express.json());

app.use("/api/ai", aiRoute);

app.listen(process.env.PORT, () => {
  console.log("Backend running on http://localhost:5000");
});
