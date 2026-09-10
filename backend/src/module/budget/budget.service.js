import prisma from "../../config/database.js";
import { ApiError } from "../../utils/apiError.js";


// ==========================================
// HELPER – Calculate Spending for a Budget
// ==========================================

const calculateSpent = async (userId, categoryId, startDate, endDate) => {

    const result = await prisma.transaction.aggregate({
        where: {
            userId,
            categoryId,
            type: "EXPENSE",
            date: {
                gte: startDate,
                lte: endDate
            }
        },
        _sum: { amount: true }
    });

    return Number(result._sum.amount ?? 0);
};


const budgetWithProgress = async (budget, userId) => {

    const spent      = await calculateSpent(userId, budget.categoryId, budget.startDate, budget.endDate);
    const total      = Number(budget.amount);
    const remaining  = total - spent;
    const percentage = total > 0 ? Math.min(100, Math.round((spent / total) * 100)) : 0;

    return { ...budget, spent, remaining, percentage };
};


// ==========================================
// LIST BUDGETS
// ==========================================

export const getBudgets = async (userId) => {

    const budgets = await prisma.budget.findMany({
        where  : { userId },
        include: {
            category: { select: { id: true, name: true, icon: true, color: true } }
        },
        orderBy: { startDate: "desc" }
    });

    const withProgress = await Promise.all(
        budgets.map(b => budgetWithProgress(b, userId))
    );

    return withProgress;
};


// ==========================================
// GET SINGLE BUDGET
// ==========================================

export const getBudget = async (userId, budgetId) => {

    const budget = await prisma.budget.findFirst({
        where  : { id: budgetId, userId },
        include: {
            category: { select: { id: true, name: true, icon: true, color: true } }
        }
    });

    if (!budget) throw ApiError.notFound("Budget not found");

    return budgetWithProgress(budget, userId);
};


// ==========================================
// CREATE BUDGET
// ==========================================

export const createBudget = async (userId, data) => {

    // Ensure category exists and is accessible
    const category = await prisma.category.findFirst({
        where: {
            id: data.categoryId,
            OR: [{ userId }, { isDefault: true }]
        }
    });
    if (!category) throw ApiError.notFound("Category not found");

    const budget = await prisma.budget.create({
        data: {
            userId,
            categoryId: data.categoryId,
            amount    : data.amount,
            period    : data.period ?? "MONTHLY",
            startDate : data.startDate,
            endDate   : data.endDate
        },
        include: {
            category: { select: { id: true, name: true, icon: true, color: true } }
        }
    });

    return budgetWithProgress(budget, userId);
};


// ==========================================
// UPDATE BUDGET
// ==========================================

export const updateBudget = async (userId, budgetId, data) => {

    const budget = await prisma.budget.findFirst({
        where: { id: budgetId, userId }
    });

    if (!budget) throw ApiError.notFound("Budget not found");

    const updated = await prisma.budget.update({
        where  : { id: budgetId },
        data,
        include: {
            category: { select: { id: true, name: true, icon: true, color: true } }
        }
    });

    return budgetWithProgress(updated, userId);
};


// ==========================================
// DELETE BUDGET
// ==========================================

export const deleteBudget = async (userId, budgetId) => {

    const budget = await prisma.budget.findFirst({
        where: { id: budgetId, userId }
    });

    if (!budget) throw ApiError.notFound("Budget not found");

    await prisma.budget.delete({ where: { id: budgetId } });

    return { message: "Budget deleted successfully" };
};
