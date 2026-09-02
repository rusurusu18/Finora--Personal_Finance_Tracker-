import * as authService from "./auth.service.js";


// ==========================================
// REGISTER
// ==========================================

export const register = async (req, res) => {

    try {

        const user = await authService.register(
            req.body
        );


        return res.status(201).json({
            success: true,
            message: "Registration successful",
            data: user
        });

    } catch (error) {

        console.error(
            "Register error:",
            error
        );

        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message:
                error.message ||
                "Registration failed"
        });
    }
};


// ==========================================
// LOGIN
// ==========================================

export const login = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        const result =
            await authService.login(
                email,
                password
            );


        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: result
        });

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message:
                error.message ||
                "Login failed"
        });
    }
};


// ==========================================
// REFRESH TOKEN
// ==========================================

export const refreshToken = async (
    req,
    res
) => {

    try {

        const {
            refreshToken
        } = req.body;


        const result =
            await authService.refreshAccessToken(
                refreshToken
            );


        return res.status(200).json({
            success: true,
            message: "Access token refreshed successfully",
            data: result
        });

    } catch (error) {

        console.error(
            "Refresh token error:",
            error
        );

        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message:
                error.message ||
                "Failed to refresh access token"
        });
    }
};


// ==========================================
// GET PROFILE
// ==========================================

export const getProfile = async (
    req,
    res
) => {

    try {

        const user =
            await authService.getProfile(
                req.user.id
            );


        return res.status(200).json({
            success: true,
            message: "Profile retrieved successfully",
            data: user
        });

    } catch (error) {

        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================================
// FORGOT PASSWORD
// ==========================================

export const forgotPassword = async (
    req,
    res
) => {

    try {

        const {
            email
        } = req.body;


        const result =
            await authService.forgotPassword(
                email
            );


        return res.status(200).json({
            success: true,
            message: result.message,

            // Development only
            data: result.resetToken
                ? {
                    resetToken:
                        result.resetToken
                }
                : null
        });

    } catch (error) {

        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================================
// RESET PASSWORD
// ==========================================

export const resetPassword = async (
    req,
    res
) => {

    try {

        const {
            token,
            password
        } = req.body;


        const result =
            await authService.resetPassword(
                token,
                password
            );


        return res.status(200).json({
            success: true,
            message: result.message
        });

    } catch (error) {

        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================================
// CHANGE PASSWORD
// ==========================================

export const changePassword = async (
    req,
    res
) => {

    try {

        const {
            currentPassword,
            newPassword
        } = req.body;


        const result =
            await authService.changePassword(
                req.user.id,
                currentPassword,
                newPassword
            );


        return res.status(200).json({
            success: true,
            message: result.message
        });

    } catch (error) {

        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================================
// LOGOUT
// ==========================================

export const logout = async (
    req,
    res
) => {

    try {

        const result =
            await authService.logout(
                req.user.id
            );


        return res.status(200).json({
            success: true,
            message: result.message
        });

    } catch (error) {

        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message:
                error.message ||
                "Logout failed"
        });
    }
};