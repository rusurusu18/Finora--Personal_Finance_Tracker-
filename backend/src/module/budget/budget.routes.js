import express from "express";

import * as budgetController from "./budget.controller.js";
import { createBudgetSchema, updateBudgetSchema } from "./budget.schema.js";
import { authenticate } from "../../middleware/authMiddleware.js";
import { validate }     from "../../middleware/validateMiddleware.js";


const router = express.Router();

router.use(authenticate);


router.get(   "/",    budgetController.getBudgets);
router.post(  "/",    validate(createBudgetSchema), budgetController.createBudget);
router.get(   "/:id", budgetController.getBudget);
router.patch( "/:id", validate(updateBudgetSchema), budgetController.updateBudget);
router.delete("/:id", budgetController.deleteBudget);


export default router;
