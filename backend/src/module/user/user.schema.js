import { z } from "zod";


// ==========================================
// UPDATE PROFILE
// ==========================================

export const updateProfileSchema = z.object({

    fullName: z
        .string()
        .min(2,   "Full name must be at least 2 characters")
        .max(100, "Full name must not exceed 100 characters")
        .optional(),

    phone: z
        .string()
        .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
        .optional()
        .nullable(),

    avatarUrl: z
        .string()
        .url("Must be a valid URL")
        .optional()
        .nullable(),

    currency: z
        .string()
        .length(3, "Currency must be a 3-letter code (e.g. NPR, USD)")
        .toUpperCase()
        .optional()
});
