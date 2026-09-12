import prisma from "../../config/database.js";

// ==========================================
// GET DASHBOARD SUMMARY
// ==========================================

export const getDashboardSummary = async (userId) => {
    // 1. Get Accounts and Total Balance
    const accounts = await prisma.account.findMany({
        where: { userId }
    });
    const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);

    // 2. Get Recent Transactions (last 5)
    const recentTransactions = await prisma.transaction.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        take: 5,
        include: {
            category: { select: { name: true, icon: true, color: true } },
            account: { select: { name: true, type: true } }
        }
    });

    // 3. Current Month Income & Expenses
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999);

    const monthTransactions = await prisma.transaction.findMany({
        where: {
            userId,
            date: {
                gte: startOfMonth,
                lte: endOfMonth
            }
        },
        select: {
            type: true,
            amount: true
        }
    });

    let monthlyIncome = 0;
    let monthlyExpense = 0;

    monthTransactions.forEach(t => {
        if (t.type === "INCOME") monthlyIncome += Number(t.amount);
        if (t.type === "EXPENSE") monthlyExpense += Number(t.amount);
    });

    // 4. Get Active Budgets
    const budgets = await prisma.budget.findMany({
        where: { userId },
        include: {
            category: { select: { name: true, icon: true, color: true } }
        },
        take: 3
    });

    // Calculate budget spending
    const budgetsWithSpending = await Promise.all(budgets.map(async (budget) => {
        const spent = await prisma.transaction.aggregate({
            where: {
                userId,
                categoryId: budget.categoryId,
                type: "EXPENSE",
                date: {
                    gte: budget.startDate,
                    lte: budget.endDate
                }
            },
            _sum: {
                amount: true
            }
        });

        const totalSpent = Number(spent._sum.amount || 0);
        return {
            ...budget,
            spent: totalSpent,
            percentage: budget.amount > 0 ? Math.min(100, Math.round((totalSpent / Number(budget.amount)) * 100)) : 0
        };
    }));

    // 5. Get Active Goals
    const goals = await prisma.savingsGoal.findMany({
        where: { userId, status: "ACTIVE" },
        take: 3
    });

    const goalsWithProgress = goals.map(goal => {
        const current = Number(goal.currentAmount);
        const target = Number(goal.targetAmount);
        const percentage = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
        return { ...goal, percentage };
    });

    return {
        totalBalance,
        monthlyIncome,
        monthlyExpense,
        accounts,
        recentTransactions,
        budgets: budgetsWithSpending,
        goals: goalsWithProgress
    };
};
