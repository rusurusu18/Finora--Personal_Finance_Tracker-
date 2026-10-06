import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";
import { validate } from "../../middleware/validateMiddleware.js";
import * as loanController from "./loan.controller.js";
import { createLoanPlanSchema } from "./loan.schema.js";

const router = express.Router();

router.use(authenticate);
router.get("/", loanController.getLoanPlans);
router.post("/", validate(createLoanPlanSchema), loanController.createLoanPlan);
router.delete("/:id", loanController.deleteLoanPlan);

export default router;
