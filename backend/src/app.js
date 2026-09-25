import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import apiRoutes from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware.js";
import { generalLimiter } from "./middleware/rateLimitMiddleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(generalLimiter);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Finora API is running",
  });
});

app.get("/api/v1/health", (req, res) => {
  res.json({
    success: true,
    message: "ok",
  });
});

app.use("/api/v1", apiRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
