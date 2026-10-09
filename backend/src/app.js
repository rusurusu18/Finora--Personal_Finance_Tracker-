import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import apiRoutes from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware.js";
import { generalLimiter } from "./middleware/rateLimitMiddleware.js";

const app = express();

// Allow the frontend to call the API from a local dev server.
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// Parse cookies and JSON bodies so auth and request data can be read easily.
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(generalLimiter);

// Basic health check for the API root.
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Finora API is running",
  });
});

// Health endpoint used by monitoring or deployment checks.
app.get("/api/v1/health", (req, res) => {
  res.json({
    success: true,
    message: "ok",
  });
});

// All application routes live under the versioned API prefix.
app.use("/api/v1", apiRoutes);

// Error middleware is registered last so unexpected issues are handled consistently.
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
