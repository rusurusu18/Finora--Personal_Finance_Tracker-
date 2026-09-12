import express from "express";
import { getDashboardSummary } from "./dashboard.controller.js";
import { requireAuth } from "../../middleware/authMiddleware.js";

const router = express.Router();

// All dashboard routes require authentication
router.use(requireAuth);

router.get("/", getDashboardSummary);

export default router;
