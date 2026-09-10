import { z } from "zod";


// ==========================================
// CREATE ACCOUNT
// ==========================================

export const createAccountSchema = z.object({

    name: z
        .string()
        .min(1, "Account name is required")
        .max(100, "Account name must not exceed 100 characters"),

    type: z.enum(["BANK", "WALLET", "CASH"], {
        error: "Account type must be BANK, WALLET, or CASH"
    }),

    balance: z
        .number()
        .min(0, "Balance cannot be negative")
        .default(0),

    currency: z
        .string()
        .length(3, "Currency must be a 3-letter code")
        .toUpperCase()
        .default("NPR"),

    icon : z.string().optional(),
    color: z.string().optional()
});


// ==========================================
// UPDATE ACCOUNT
// ==========================================

export const updateAccountSchema = z.object({

    name: z
        .string()
        .min(1)
        .max(100)
        .optional(),

    icon : z.string().optional().nullable(),
    color: z.string().optional().nullable()
});
