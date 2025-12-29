import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import aiRoute from "./routes/ai.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://parit-iii.github.io"
  ],
  credentials: true
}));


app.use(express.json());

/* ✅ ใส่ตรงนี้ */
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.use("/api/ai", aiRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
