import express from "express";
import { getDashboardSummary } from "./dashboard.controller.js";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

// All dashboard routes require authentication
router.use(authenticate);

router.get("/", getDashboardSummary);

export default router;
