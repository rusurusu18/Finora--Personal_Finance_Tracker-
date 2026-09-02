import express from "express";

import * as authController
    from "./auth.controller.js";

import {
    registerSchema,
    loginSchema,
    refreshTokenSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema
} from "./auth.schema.js";

import { validate }
    from "../../middleware/validateMiddleware.js";

import { authenticate }
    from "../../middleware/authMiddleware.js";


const router = express.Router();


// ==========================================
// PUBLIC ROUTES
// ==========================================

// Register
router.post(
    "/register",
    validate(registerSchema),
    authController.register
);


// Login
router.post(
    "/login",
    validate(loginSchema),
    authController.login
);


// Refresh access token
router.post(
    "/refresh-token",
    validate(refreshTokenSchema),
    authController.refreshToken
);


// Forgot password
router.post(
    "/forgot-password",
    validate(forgotPasswordSchema),
    authController.forgotPassword
);


// Reset password
router.post(
    "/reset-password",
    validate(resetPasswordSchema),
    authController.resetPassword
);


// ==========================================
// PROTECTED ROUTES
// ==========================================

// Get current user's profile
router.get(
    "/profile",
    authenticate,
    authController.getProfile
);


// Change password
router.post(
    "/change-password",
    authenticate,
    validate(changePasswordSchema),
    authController.changePassword
);


// Logout
router.post(
    "/logout",
    authenticate,
    authController.logout
);


export default router;