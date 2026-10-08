import { z } from "zod";


// ==========================================
// CREATE TRANSACTION
// ==========================================

export const createTransactionSchema = z.object({

    accountId: z
        .string()
        .min(1, "Account is required"),

    toAccountId: z
        .string()
        .optional()
        .nullable(),

    categoryId: z
        .string()
        .optional()
        .nullable(),

    type: z.enum(["INCOME", "EXPENSE", "TRANSFER"], {
        error: "Transaction type must be INCOME, EXPENSE, or TRANSFER"
    }),

    amount: z
        .number()
        .positive("Amount must be greater than zero"),

    description: z
        .string()
        .min(1, "Description is required")
        .max(255, "Description must not exceed 255 characters"),

    paymentSource: z.string().max(100).optional().nullable(),

    notes: z
        .string()
        .max(1000, "Notes must not exceed 1000 characters")
        .optional()
        .nullable(),

    date: z
        .string()
        .datetime("Date must be a valid ISO 8601 date")
        .or(z.date())
        .transform(d => new Date(d))

}).refine(data => {
    if (data.type === "TRANSFER" && !data.toAccountId) {
        return false;
    }
    return true;
}, {
    message : "toAccountId is required for TRANSFER transactions",
    path    : ["toAccountId"]
});


// ==========================================
// UPDATE TRANSACTION
// ==========================================

export const updateTransactionSchema = z.object({

    accountId: z.string().min(1).optional(),

    type: z.enum(["INCOME", "EXPENSE"]).optional(),

    categoryId: z
        .string()
        .optional()
        .nullable(),

    amount: z
        .number()
        .positive("Amount must be greater than zero")
        .optional(),

    description: z
        .string()
        .min(1)
        .max(255)
        .optional(),

    paymentSource: z.string().max(100).optional().nullable(),

    notes: z
        .string()
        .max(1000)
        .optional()
        .nullable(),

    date: z
        .string()
        .datetime()
        .or(z.date())
        .transform(d => new Date(d))
        .optional()
});


// ==========================================
// QUERY FILTERS
// ==========================================

export const transactionQuerySchema = z.object({

    type      : z.enum(["INCOME", "EXPENSE", "TRANSFER"]).optional(),
    accountId : z.string().optional(),
    categoryId: z.string().optional(),
    startDate : z.string().datetime().optional(),
    endDate   : z.string().datetime().optional(),
    search    : z.string().optional(),
    page      : z.string().regex(/^\d+$/).optional(),
    limit     : z.string().regex(/^\d+$/).optional()
});

export const createRecurringTransactionSchema = z.object({
    accountId: z.string().min(1),
    categoryId: z.string().nullable().optional(),
    type: z.enum(["INCOME", "EXPENSE"]),
    amount: z.number().positive(),
    description: z.string().min(1).max(255),
    paymentSource: z.string().max(100).nullable().optional(),
    notes: z.string().max(1000).nullable().optional(),
    frequency: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]),
    interval: z.number().int().min(1).max(365).default(1),
    startDate: z.string().datetime().or(z.date()).transform((date) => new Date(date)),
    endDate: z.string().datetime().or(z.date()).transform((date) => new Date(date)).nullable().optional()
}).refine((data) => !data.endDate || data.endDate >= data.startDate, {
    message: "End date must be on or after the start date",
    path: ["endDate"]
});

export const updateRecurringTransactionSchema = z.object({
    isActive: z.boolean()
});
