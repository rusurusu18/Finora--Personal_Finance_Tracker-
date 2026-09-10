import prisma from "../../config/database.js";
import { ApiError } from "../../utils/apiError.js";


// ==========================================
// HELPER – Enrich goal with progress
// ==========================================

const withProgress = (goal) => {

    const current    = Number(goal.currentAmount);
    const target     = Number(goal.targetAmount);
    const percentage = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
    const remaining  = Math.max(0, target - current);

    return { ...goal, percentage, remaining };
};


// ==========================================
// LIST GOALS
// ==========================================

export const getGoals = async (userId, status) => {

    const where = { userId };
    if (status) where.status = status;

    const goals = await prisma.savingsGoal.findMany({
        where,
        orderBy: { createdAt: "desc" }
    });

    return goals.map(withProgress);
};


// ==========================================
// GET SINGLE GOAL
// ==========================================

export const getGoal = async (userId, goalId) => {

    const goal = await prisma.savingsGoal.findFirst({
        where: { id: goalId, userId }
    });

    if (!goal) throw ApiError.notFound("Savings goal not found");

    return withProgress(goal);
};


// ==========================================
// CREATE GOAL
// ==========================================

export const createGoal = async (userId, data) => {

    const goal = await prisma.savingsGoal.create({
        data: {
            userId,
            name         : data.name,
            targetAmount : data.targetAmount,
            currentAmount: data.currentAmount ?? 0,
            targetDate   : data.targetDate    ?? null,
            icon         : data.icon          ?? null,
            color        : data.color         ?? null,
            status       : "ACTIVE"
        }
    });

    return withProgress(goal);
};


// ==========================================
// UPDATE GOAL
// ==========================================

export const updateGoal = async (userId, goalId, data) => {

    const goal = await prisma.savingsGoal.findFirst({
        where: { id: goalId, userId }
    });

    if (!goal) throw ApiError.notFound("Savings goal not found");

    // Auto-complete if currentAmount reaches target
    let status = data.status ?? goal.status;
    if (
        data.currentAmount !== undefined &&
        Number(data.currentAmount) >= Number(goal.targetAmount) &&
        status !== "PAUSED"
    ) {
        status = "COMPLETED";
    }

    const updated = await prisma.savingsGoal.update({
        where: { id: goalId },
        data : {
            name         : data.name          ?? goal.name,
            targetAmount : data.targetAmount   ?? goal.targetAmount,
            currentAmount: data.currentAmount  ?? goal.currentAmount,
            targetDate   : data.targetDate     !== undefined ? data.targetDate   : goal.targetDate,
            status,
            icon : data.icon  !== undefined ? data.icon  : goal.icon,
            color: data.color !== undefined ? data.color : goal.color
        }
    });

    return withProgress(updated);
};


// ==========================================
// DEPOSIT TO GOAL
// ==========================================

export const depositToGoal = async (userId, goalId, amount) => {

    const goal = await prisma.savingsGoal.findFirst({
        where: { id: goalId, userId }
    });

    if (!goal)             throw ApiError.notFound("Savings goal not found");
    if (goal.status === "COMPLETED") throw ApiError.badRequest("This goal is already completed");

    const newAmount = Number(goal.currentAmount) + amount;
    const status    = newAmount >= Number(goal.targetAmount) ? "COMPLETED" : goal.status;

    const updated = await prisma.savingsGoal.update({
        where: { id: goalId },
        data : { currentAmount: newAmount, status }
    });

    return withProgress(updated);
};


// ==========================================
// DELETE GOAL
// ==========================================

export const deleteGoal = async (userId, goalId) => {

    const goal = await prisma.savingsGoal.findFirst({
        where: { id: goalId, userId }
    });

    if (!goal) throw ApiError.notFound("Savings goal not found");

    await prisma.savingsGoal.delete({ where: { id: goalId } });

    return { message: "Savings goal deleted successfully" };
};
