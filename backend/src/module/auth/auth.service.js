import bcrypt from "bcrypt";
import crypto from "crypto";

import prisma from "../../config/database.js";

import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
} from "../../utils/jwt.js";


// ==========================================
// REGISTER
// ==========================================

export const register = async (userData) => {

    const {
        fullName,
        email,
        password,
        phone,
        role
    } = userData;


    const existingUser = await prisma.user.findUnique({
        where: {
            email
        }
    });


    if (existingUser) {
        const error = new Error(
            "Email is already registered"
        );

        error.statusCode = 409;

        throw error;
    }


    const hashedPassword = await bcrypt.hash(
        password,
        12
    );


    const user = await prisma.user.create({
        data: {
            fullName,
            email,
            password: hashedPassword,
            phone,
            role: role || "USER"
        }
    });


    const {
        password: _password,
        ...safeUser
    } = user;


    return safeUser;
};


// ==========================================
// LOGIN
// ==========================================

export const login = async (
    email,
    password
) => {

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });


    if (!user) {
        const error = new Error(
            "Invalid email or password"
        );

        error.statusCode = 401;

        throw error;
    }


    const passwordMatch = await bcrypt.compare(
        password,
        user.password
    );


    if (!passwordMatch) {
        const error = new Error(
            "Invalid email or password"
        );

        error.statusCode = 401;

        throw error;
    }


    const accessToken = generateAccessToken({
        id: user.id,
        email: user.email,
        role: user.role
    });


    const refreshToken = generateRefreshToken({
        id: user.id
    });


    const {
        password: _password,
        ...safeUser
    } = user;


    return {
        user: safeUser,
        accessToken,
        refreshToken
    };
};


// ==========================================
// REFRESH ACCESS TOKEN
// ==========================================

export const refreshAccessToken = async (
    refreshToken
) => {

    let decoded;

    try {

        decoded = verifyRefreshToken(
            refreshToken
        );

    } catch (error) {

        const authError = new Error(
            "Invalid or expired refresh token"
        );

        authError.statusCode = 401;

        throw authError;
    }


    const user = await prisma.user.findUnique({
        where: {
            id: decoded.id
        }
    });


    if (!user) {
        const error = new Error(
            "User not found"
        );

        error.statusCode = 404;

        throw error;
    }


    const accessToken = generateAccessToken({
        id: user.id,
        email: user.email,
        role: user.role
    });


    return {
        accessToken
    };
};


// ==========================================
// GET PROFILE
// ==========================================

export const getProfile = async (userId) => {

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },

        select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
            updatedAt: true
        }
    });


    if (!user) {
        const error = new Error(
            "User not found"
        );

        error.statusCode = 404;

        throw error;
    }


    return user;
};


// ==========================================
// FORGOT PASSWORD
// ==========================================

export const forgotPassword = async (
    email
) => {

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });


    if (!user) {
        return {
            message:
                "If an account exists with this email, a password reset link will be sent."
        };
    }


    const resetToken = crypto
        .randomBytes(32)
        .toString("hex");


    const resetTokenHash = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");


    const resetTokenExpiry = new Date(
        Date.now() + 15 * 60 * 1000
    );


    await prisma.user.update({
        where: {
            id: user.id
        },

        data: {
            resetToken: resetTokenHash,
            resetTokenExpiry
        }
    });


    return {
        message:
            "If an account exists with this email, a password reset link will be sent.",

        // Development only.
        // Remove this after email service is implemented.
        resetToken
    };
};


// ==========================================
// RESET PASSWORD
// ==========================================

export const resetPassword = async (
    token,
    newPassword
) => {

    const resetTokenHash = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");


    const user = await prisma.user.findFirst({
        where: {
            resetToken: resetTokenHash,

            resetTokenExpiry: {
                gt: new Date()
            }
        }
    });


    if (!user) {
        const error = new Error(
            "Invalid or expired reset token"
        );

        error.statusCode = 400;

        throw error;
    }


    const hashedPassword = await bcrypt.hash(
        newPassword,
        12
    );


    await prisma.user.update({
        where: {
            id: user.id
        },

        data: {
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null
        }
    });


    return {
        message: "Password reset successfully"
    };
};


// ==========================================
// CHANGE PASSWORD
// ==========================================

export const changePassword = async (
    userId,
    currentPassword,
    newPassword
) => {

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });


    if (!user) {
        const error = new Error(
            "User not found"
        );

        error.statusCode = 404;

        throw error;
    }


    const passwordMatch = await bcrypt.compare(
        currentPassword,
        user.password
    );


    if (!passwordMatch) {
        const error = new Error(
            "Current password is incorrect"
        );

        error.statusCode = 401;

        throw error;
    }


    const hashedPassword = await bcrypt.hash(
        newPassword,
        12
    );


    await prisma.user.update({
        where: {
            id: userId
        },

        data: {
            password: hashedPassword
        }
    });


    return {
        message: "Password changed successfully"
    };
};


// ==========================================
// LOGOUT
// ==========================================

export const logout = async (userId) => {

    // Currently JWT based logout is handled
    // on the client by removing the tokens.

    // When database sessions/token storage is
    // added, revoke the refresh token here.

    return {
        message: "Logout successful"
    };
};