import express from "express";

import * as transactionController from "./transaction.controller.js";
import {
    createTransactionSchema,
    updateTransactionSchema
} from "./transaction.schema.js";
import { authenticate } from "../../middleware/authMiddleware.js";
import { validate }     from "../../middleware/validateMiddleware.js";


const router = express.Router();

router.use(authenticate);


// GET    /api/transactions/summary  (before /:id)
router.get("/summary", transactionController.getSummary);

// GET    /api/transactions
router.get(   "/",    transactionController.getTransactions);

// POST   /api/transactions
router.post(  "/",    validate(createTransactionSchema), transactionController.createTransaction);

// GET    /api/transactions/:id
router.get(   "/:id", transactionController.getTransaction);

// PATCH  /api/transactions/:id
router.patch( "/:id", validate(updateTransactionSchema), transactionController.updateTransaction);

// DELETE /api/transactions/:id
router.delete("/:id", transactionController.deleteTransaction);


export default router;
