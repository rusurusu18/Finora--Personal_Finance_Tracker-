import { z } from "zod";


// ==========================================
// CREATE CATEGORY
// ==========================================

export const createCategorySchema = z.object({

    name: z
        .string()
        .min(1,  "Category name is required")
        .max(50, "Category name must not exceed 50 characters"),

    type: z.enum(["INCOME", "EXPENSE"], {
        error: "Category type must be INCOME or EXPENSE"
    }),

    color: z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex color (e.g. #6366f1)")
        .optional()
        .default("#6366f1"),

    icon: z
        .string()
        .max(10, "Icon must not exceed 10 characters")
        .optional()
        .default("📦")
});


// ==========================================
// UPDATE CATEGORY
// ==========================================

export const updateCategorySchema = z.object({

    name: z
        .string()
        .min(1)
        .max(50)
        .optional(),

    color: z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex color")
        .optional(),

    icon: z
        .string()
        .max(10)
        .optional()
});
