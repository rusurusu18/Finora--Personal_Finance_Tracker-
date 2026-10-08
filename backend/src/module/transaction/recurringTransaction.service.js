import prisma from "../../config/database.js";
import { ApiError } from "../../utils/apiError.js";
import { advanceRecurrenceDate } from "./recurringTransaction.scheduler.js";

const recurringInclude = {
    account: { select: { id: true, name: true, type: true } },
    category: { select: { id: true, name: true } }
};

export const getRecurringTransactions = async (userId) =>
    prisma.recurringTransaction.findMany({
        where: { userId },
        include: recurringInclude,
        orderBy: [{ isActive: "desc" }, { nextRunAt: "asc" }]
    });

export const createRecurringTransaction = async (userId, data) => {
    const account = await prisma.account.findFirst({
        where: { id: data.accountId, userId }
    });
    if (!account) throw ApiError.notFound("Account not found");

    if (data.categoryId) {
        const category = await prisma.category.findFirst({
            where: {
                id: data.categoryId,
                OR: [{ userId }, { isDefault: true }]
            }
        });
        if (!category) throw ApiError.notFound("Category not found");
    }

    return prisma.recurringTransaction.create({
        data: {
            userId,
            accountId: data.accountId,
            categoryId: data.categoryId ?? null,
            type: data.type,
            amount: data.amount,
            description: data.description,
            paymentSource: data.paymentSource ?? account.institution ?? account.name,
            notes: data.notes ?? null,
            frequency: data.frequency,
            interval: data.interval,
            startDate: data.startDate,
            nextRunAt: data.startDate,
            endDate: data.endDate ?? null
        },
        include: recurringInclude
    });
};

export const updateRecurringTransaction = async (userId, recurringTransactionId, data) => {
    const existing = await prisma.recurringTransaction.findFirst({
        where: { id: recurringTransactionId, userId }
    });
    if (!existing) throw ApiError.notFound("Recurring transaction not found");

    let nextRunAt = existing.nextRunAt;
    let isActive = data.isActive;
    if (data.isActive && !existing.isActive) {
        const now = new Date();
        while (nextRunAt <= now) {
            nextRunAt = advanceRecurrenceDate(
                nextRunAt,
                existing.frequency,
                existing.interval,
                existing.startDate
            );
        }
        if (existing.endDate && nextRunAt > existing.endDate) isActive = false;
    }

    return prisma.recurringTransaction.update({
        where: { id: recurringTransactionId },
        data: { isActive, nextRunAt },
        include: recurringInclude
    });
};

export const deleteRecurringTransaction = async (userId, recurringTransactionId) => {
    const existing = await prisma.recurringTransaction.findFirst({
        where: { id: recurringTransactionId, userId }
    });
    if (!existing) throw ApiError.notFound("Recurring transaction not found");

    await prisma.recurringTransaction.delete({
        where: { id: recurringTransactionId }
    });

    return { message: "Recurring transaction deleted successfully" };
};
