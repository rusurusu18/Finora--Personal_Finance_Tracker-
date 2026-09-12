import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Routes & Middlewares
import apiRoutes from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Finora API is running" });
});

// API Routes
app.use("/api/v1", apiRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
