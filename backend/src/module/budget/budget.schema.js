import { z } from "zod";


// ==========================================
// CREATE BUDGET
// ==========================================

export const createBudgetSchema = z.object({

    categoryId: z
        .string()
        .min(1, "Category is required"),

    amount: z
        .number()
        .positive("Budget amount must be greater than zero"),

    period: z
        .enum(["WEEKLY", "MONTHLY", "YEARLY"])
        .default("MONTHLY"),

    startDate: z
        .string()
        .datetime()
        .or(z.date())
        .transform(d => new Date(d)),

    endDate: z
        .string()
        .datetime()
        .or(z.date())
        .transform(d => new Date(d))

}).refine(data => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path   : ["endDate"]
});


// ==========================================
// UPDATE BUDGET
// ==========================================

export const updateBudgetSchema = z.object({

    amount: z
        .number()
        .positive()
        .optional(),

    period: z
        .enum(["WEEKLY", "MONTHLY", "YEARLY"])
        .optional(),

    startDate: z
        .string()
        .datetime()
        .or(z.date())
        .transform(d => new Date(d))
        .optional(),

    endDate: z
        .string()
        .datetime()
        .or(z.date())
        .transform(d => new Date(d))
        .optional()
});
