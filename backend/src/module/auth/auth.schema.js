import { z } from "zod";


// ==========================================
// REGISTER
// ==========================================

export const registerSchema = z.object({
    fullName: z
        .string()
        .min(2, "Full name must be at least 2 characters")
        .max(100, "Full name must not exceed 100 characters"),

    email: z
        .string()
        .email("Please provide a valid email address")
        .toLowerCase(),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password must contain at least one uppercase letter, one lowercase letter and one number"
        ),

    phone: z
        .string()
        .regex(
            /^[0-9]{10}$/,
            "Phone number must be exactly 10 digits"
        )
        .optional(),

    role: z
        .enum(["USER", "ADMIN"])
        .optional()
});


// ==========================================
// LOGIN
// ==========================================

export const loginSchema = z.object({
    email: z
        .string()
        .email("Please provide a valid email address")
        .toLowerCase(),

    password: z
        .string()
        .min(1, "Password is required")
});


// ==========================================
// REFRESH TOKEN
// ==========================================

export const refreshTokenSchema = z.object({
    refreshToken: z
        .string()
        .min(1, "Refresh token is required")
});


// ==========================================
// FORGOT PASSWORD
// ==========================================

export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .email("Please provide a valid email address")
        .toLowerCase()
});


// ==========================================
// RESET PASSWORD
// ==========================================

export const resetPasswordSchema = z.object({
    token: z
        .string()
        .min(1, "Reset token is required"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password must contain at least one uppercase letter, one lowercase letter and one number"
        )
});


// ==========================================
// CHANGE PASSWORD
// ==========================================

export const changePasswordSchema = z.object({
    currentPassword: z
        .string()
        .min(1, "Current password is required"),

    newPassword: z
        .string()
        .min(8, "New password must be at least 8 characters")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "New password must contain at least one uppercase letter, one lowercase letter and one number"
        )
});