import express from "express";

import authRoutes from "../module/auth/auth.routes.js";
import userRoutes from "../module/user/user.routes.js";
import accountRoutes from "../module/account/account.routes.js";
import transactionRoutes from "../module/transaction/transaction.routes.js";
import categoryRoutes from "../module/category/category.routes.js";
import budgetRoutes from "../module/budget/budget.routes.js";
import goalRoutes from "../module/goal/goal.routes.js";
import dashboardRoutes from "../module/dashboard/dashboard.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/accounts", accountRoutes);
router.use("/transactions", transactionRoutes);
router.use("/categories", categoryRoutes);
router.use("/budgets", budgetRoutes);
router.use("/goals", goalRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
