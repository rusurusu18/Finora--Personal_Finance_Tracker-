import prisma from "../../config/database.js";
import { ApiError } from "../../utils/apiError.js";


// ==========================================
// LIST ACCOUNTS
// ==========================================

export const getAccounts = async (userId) => {

    const accounts = await prisma.account.findMany({
        where  : { userId },
        orderBy: { createdAt: "asc" }
    });

    // Aggregate totals by type
    const totals = accounts.reduce(
        (acc, a) => {
            const bal = Number(a.balance);
            acc.total += bal;
            if (a.type === "BANK")   acc.bank    += bal;
            if (a.type === "WALLET") acc.wallets += bal;
            if (a.type === "CASH")   acc.cash    += bal;
            return acc;
        },
        { total: 0, bank: 0, wallets: 0, cash: 0 }
    );

    return { accounts, totals };
};


// ==========================================
// GET SINGLE ACCOUNT
// ==========================================

export const getAccount = async (userId, accountId) => {

    const account = await prisma.account.findFirst({
        where  : { id: accountId, userId },
        include: {
            transactions: {
                orderBy: { date: "desc" },
                take   : 10,
                include: { category: true }
            }
        }
    });

    if (!account) throw ApiError.notFound("Account not found");

    return account;
};


// ==========================================
// CREATE ACCOUNT
// ==========================================

export const createAccount = async (userId, data) => {

    const account = await prisma.account.create({
        data: {
            userId,
            name    : data.name,
            type    : data.type,
            balance : data.balance  ?? 0,
            currency: data.currency ?? "NPR",
            icon    : data.icon,
            color   : data.color
        }
    });

    return account;
};


// ==========================================
// UPDATE ACCOUNT
// ==========================================

export const updateAccount = async (userId, accountId, data) => {

    const account = await prisma.account.findFirst({
        where: { id: accountId, userId }
    });

    if (!account) throw ApiError.notFound("Account not found");

    const updated = await prisma.account.update({
        where: { id: accountId },
        data
    });

    return updated;
};


// ==========================================
// DELETE ACCOUNT
// ==========================================

export const deleteAccount = async (userId, accountId) => {

    const account = await prisma.account.findFirst({
        where: { id: accountId, userId }
    });

    if (!account) throw ApiError.notFound("Account not found");

    await prisma.account.delete({ where: { id: accountId } });

    return { message: "Account deleted successfully" };
};
