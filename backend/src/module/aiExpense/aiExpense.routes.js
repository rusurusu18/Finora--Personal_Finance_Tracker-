import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";
import { validate } from "../../middleware/validateMiddleware.js";
import { aiExpenseLimiter } from "../../middleware/rateLimitMiddleware.js";
import * as aiExpenseController from "./aiExpense.controller.js";
import { parseExpenseSchema } from "./aiExpense.schema.js";

const router = express.Router();

router.use(authenticate, aiExpenseLimiter);
router.post("/parse", validate(parseExpenseSchema), aiExpenseController.parseExpense);

export default router;
