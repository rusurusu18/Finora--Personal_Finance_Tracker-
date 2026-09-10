import { z } from "zod";


// ==========================================
// CREATE GOAL
// ==========================================

export const createGoalSchema = z.object({

    name: z
        .string()
        .min(1,   "Goal name is required")
        .max(100, "Goal name must not exceed 100 characters"),

    targetAmount: z
        .number()
        .positive("Target amount must be greater than zero"),

    currentAmount: z
        .number()
        .min(0, "Current amount cannot be negative")
        .default(0),

    targetDate: z
        .string()
        .datetime()
        .or(z.date())
        .transform(d => new Date(d))
        .optional()
        .nullable(),

    icon : z.string().max(10).optional().nullable(),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color").optional().nullable()
});


// ==========================================
// UPDATE GOAL
// ==========================================

export const updateGoalSchema = z.object({

    name: z
        .string()
        .min(1)
        .max(100)
        .optional(),

    targetAmount: z
        .number()
        .positive()
        .optional(),

    currentAmount: z
        .number()
        .min(0)
        .optional(),

    targetDate: z
        .string()
        .datetime()
        .or(z.date())
        .transform(d => new Date(d))
        .optional()
        .nullable(),

    status: z
        .enum(["ACTIVE", "COMPLETED", "PAUSED"])
        .optional(),

    icon : z.string().max(10).optional().nullable(),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().nullable()
});


// ==========================================
// DEPOSIT TO GOAL
// ==========================================

export const depositSchema = z.object({
    amount: z
        .number()
        .positive("Deposit amount must be greater than zero")
});
