import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Finora API is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
