import prisma from "../../config/database.js";

export const advanceRecurrenceDate = (date, frequency, interval, anchorDate = date) => {
    const next = new Date(date);

    if (frequency === "DAILY") {
        next.setUTCDate(next.getUTCDate() + interval);
        return next;
    }
    if (frequency === "WEEKLY") {
        next.setUTCDate(next.getUTCDate() + 7 * interval);
        return next;
    }

    const targetYear = frequency === "YEARLY"
        ? next.getUTCFullYear() + interval
        : next.getUTCFullYear();
    const targetMonth = frequency === "YEARLY"
        ? anchorDate.getUTCMonth()
        : next.getUTCMonth() + interval;
    const day = anchorDate.getUTCDate();
    const lastDay = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate();
    next.setUTCDate(1);
    next.setUTCFullYear(targetYear);
    next.setUTCMonth(targetMonth);
    next.setUTCDate(Math.min(day, lastDay));
    return next;
};

const postDueOccurrence = async (recurringTransactionId, now) =>
    prisma.$transaction(async (tx) => {
        const lockedRows = await tx.$queryRaw`
            SELECT "id"
            FROM "RecurringTransaction"
            WHERE "id" = ${recurringTransactionId}
              AND "isActive" = TRUE
              AND "nextRunAt" <= ${now}
            FOR UPDATE SKIP LOCKED
        `;
        if (!lockedRows.length) return false;

        const schedule = await tx.recurringTransaction.findUnique({
            where: { id: recurringTransactionId }
        });
        if (!schedule || (schedule.endDate && schedule.nextRunAt > schedule.endDate)) {
            if (schedule) {
                await tx.recurringTransaction.update({
                    where: { id: schedule.id },
                    data: { isActive: false }
                });
            }
            return false;
        }

        await tx.transaction.create({
            data: {
                userId: schedule.userId,
                accountId: schedule.accountId,
                categoryId: schedule.categoryId,
                type: schedule.type,
                amount: schedule.amount,
                description: schedule.description,
                paymentSource: schedule.paymentSource,
                notes: schedule.notes,
                date: schedule.nextRunAt,
                recurringTransactionId: schedule.id
            }
        });

        const amount = Number(schedule.amount);
        if (schedule.type === "INCOME") {
            await tx.account.update({
                where: { id: schedule.accountId },
                data: { balance: { increment: amount } }
            });
        } else {
            await tx.account.update({
                where: { id: schedule.accountId },
                data: { balance: { decrement: amount } }
            });
        }

        const nextRunAt = advanceRecurrenceDate(
            schedule.nextRunAt,
            schedule.frequency,
            schedule.interval,
            schedule.startDate
        );
        await tx.recurringTransaction.update({
            where: { id: schedule.id },
            data: {
                lastRunAt: schedule.nextRunAt,
                nextRunAt,
                isActive: !schedule.endDate || nextRunAt <= schedule.endDate
            }
        });
        return true;
    });

export const processDueRecurringTransactions = async (now = new Date()) => {
    const dueSchedules = await prisma.recurringTransaction.findMany({
        where: { isActive: true, nextRunAt: { lte: now } },
        select: { id: true },
        orderBy: { nextRunAt: "asc" },
        take: 100
    });

    for (const { id } of dueSchedules) {
        try {
            let occurrences = 0;
            while (occurrences < 1000 && await postDueOccurrence(id, now)) {
                occurrences += 1;
            }
        } catch (error) {
            console.error(`Failed to process recurring transaction ${id}:`, error);
        }
    }
};

export const startRecurringTransactionScheduler = () => {
    let running = false;
    const run = async () => {
        if (running) return;
        running = true;
        try {
            await processDueRecurringTransactions();
        } catch (error) {
            console.error("Failed to process due recurring transactions:", error);
        } finally {
            running = false;
        }
    };

    void run();
    const timer = setInterval(run, 60_000);
    timer.unref();
    return timer;
};
