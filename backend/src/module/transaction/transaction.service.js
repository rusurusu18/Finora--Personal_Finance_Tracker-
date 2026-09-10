import prisma from "../../config/database.js";
import { ApiError } from "../../utils/apiError.js";
import { parsePagination, buildPaginationMeta } from "../../utils/pagination.js";


// ==========================================
// HELPERS – Account Balance
// ==========================================

const applyBalanceEffect = async (tx, transaction, reverse = false) => {

    const sign = reverse ? -1 : 1;

    if (transaction.type === "INCOME") {
        await tx.account.update({
            where: { id: transaction.accountId },
            data : { balance: { increment: sign * Number(transaction.amount) } }
        });
    }

    if (transaction.type === "EXPENSE") {
        await tx.account.update({
            where: { id: transaction.accountId },
            data : { balance: { decrement: sign * Number(transaction.amount) } }
        });
    }

    if (transaction.type === "TRANSFER") {
        await tx.account.update({
            where: { id: transaction.accountId },
            data : { balance: { decrement: sign * Number(transaction.amount) } }
        });
        if (transaction.toAccountId) {
            await tx.account.update({
                where: { id: transaction.toAccountId },
                data : { balance: { increment: sign * Number(transaction.amount) } }
            });
        }
    }
};


const transactionInclude = {
    account  : { select: { id: true, name: true, type: true } },
    toAccount: { select: { id: true, name: true, type: true } },
    category : { select: { id: true, name: true, icon: true, color: true } }
};


// ==========================================
// LIST TRANSACTIONS
// ==========================================

export const getTransactions = async (userId, query = {}) => {

    const { page, limit, skip } = parsePagination(query);

    const where = { userId };

    if (query.type)       where.type      = query.type;
    if (query.accountId)  where.accountId = query.accountId;
    if (query.categoryId) where.categoryId = query.categoryId;

    if (query.startDate || query.endDate) {
        where.date = {};
        if (query.startDate) where.date.gte = new Date(query.startDate);
        if (query.endDate)   where.date.lte = new Date(query.endDate);
    }

    if (query.search) {
        where.description = { contains: query.search, mode: "insensitive" };
    }

    const [transactions, total] = await prisma.$transaction([
        prisma.transaction.findMany({
            where,
            include : transactionInclude,
            orderBy : { date: "desc" },
            skip,
            take    : limit
        }),
        prisma.transaction.count({ where })
    ]);

    return {
        transactions,
        meta: buildPaginationMeta({ total, page, limit })
    };
};


// ==========================================
// GET SUMMARY (income / expense / savings)
// ==========================================

export const getSummary = async (userId, query = {}) => {

    const where = { userId };

    if (query.startDate || query.endDate) {
        where.date = {};
        if (query.startDate) where.date.gte = new Date(query.startDate);
        if (query.endDate)   where.date.lte = new Date(query.endDate);
    }

    if (query.accountId) where.accountId = query.accountId;

    const [income, expense] = await Promise.all([
        prisma.transaction.aggregate({
            where: { ...where, type: "INCOME" },
            _sum : { amount: true }
        }),
        prisma.transaction.aggregate({
            where: { ...where, type: "EXPENSE" },
            _sum : { amount: true }
        })
    ]);

    const totalIncome  = Number(income._sum.amount  ?? 0);
    const totalExpense = Number(expense._sum.amount ?? 0);
    const savings      = totalIncome - totalExpense;

    return { income: totalIncome, expense: totalExpense, savings };
};


// ==========================================
// GET SINGLE TRANSACTION
// ==========================================

export const getTransaction = async (userId, transactionId) => {

    const transaction = await prisma.transaction.findFirst({
        where  : { id: transactionId, userId },
        include: transactionInclude
    });

    if (!transaction) throw ApiError.notFound("Transaction not found");

    return transaction;
};


// ==========================================
// CREATE TRANSACTION
// ==========================================

export const createTransaction = async (userId, data) => {

    // Verify account belongs to user
    const account = await prisma.account.findFirst({
        where: { id: data.accountId, userId }
    });
    if (!account) throw ApiError.notFound("Account not found");

    if (data.type === "TRANSFER" && data.toAccountId) {
        const toAccount = await prisma.account.findFirst({
            where: { id: data.toAccountId, userId }
        });
        if (!toAccount) throw ApiError.notFound("Destination account not found");
    }

    const transaction = await prisma.$transaction(async (tx) => {

        const created = await tx.transaction.create({
            data: {
                userId,
                accountId  : data.accountId,
                toAccountId: data.toAccountId ?? null,
                categoryId : data.categoryId  ?? null,
                type       : data.type,
                amount     : data.amount,
                description: data.description,
                notes      : data.notes ?? null,
                date       : data.date
            },
            include: transactionInclude
        });

        await applyBalanceEffect(tx, created);

        return created;
    });

    return transaction;
};


// ==========================================
// UPDATE TRANSACTION
// ==========================================

export const updateTransaction = async (userId, transactionId, data) => {

    const existing = await prisma.transaction.findFirst({
        where: { id: transactionId, userId }
    });

    if (!existing) throw ApiError.notFound("Transaction not found");

    const updated = await prisma.$transaction(async (tx) => {

        // Reverse old balance effect
        await applyBalanceEffect(tx, existing, true);

        // Apply updated data
        const newData = await tx.transaction.update({
            where  : { id: transactionId },
            data   : {
                categoryId : data.categoryId  ?? existing.categoryId,
                amount     : data.amount      ?? existing.amount,
                description: data.description ?? existing.description,
                notes      : data.notes       !== undefined ? data.notes : existing.notes,
                date       : data.date        ?? existing.date
            },
            include: transactionInclude
        });

        // Apply new balance effect
        await applyBalanceEffect(tx, newData);

        return newData;
    });

    return updated;
};


// ==========================================
// DELETE TRANSACTION
// ==========================================

export const deleteTransaction = async (userId, transactionId) => {

    const existing = await prisma.transaction.findFirst({
        where: { id: transactionId, userId }
    });

    if (!existing) throw ApiError.notFound("Transaction not found");

    await prisma.$transaction(async (tx) => {

        // Reverse the balance effect before deleting
        await applyBalanceEffect(tx, existing, true);

        await tx.transaction.delete({ where: { id: transactionId } });
    });

    return { message: "Transaction deleted successfully" };
};
