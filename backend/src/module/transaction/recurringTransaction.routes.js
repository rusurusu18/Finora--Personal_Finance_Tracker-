import express from "express";

import * as recurringTransactionController from "./recurringTransaction.controller.js";
import {
    createRecurringTransactionSchema,
    updateRecurringTransactionSchema
} from "./transaction.schema.js";
import { authenticate } from "../../middleware/authMiddleware.js";
import { validate } from "../../middleware/validateMiddleware.js";

const router = express.Router();

router.use(authenticate);
router.get("/", recurringTransactionController.getRecurringTransactions);
router.post("/", validate(createRecurringTransactionSchema), recurringTransactionController.createRecurringTransaction);
router.patch("/:id", validate(updateRecurringTransactionSchema), recurringTransactionController.updateRecurringTransaction);
router.delete("/:id", recurringTransactionController.deleteRecurringTransaction);

export default router;
