import { ApiError } from "../utils/apiError.js";


// ==========================================
// 404 – NOT FOUND
// ==========================================

export const notFoundHandler = (req, res, next) => {
    next(
        ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`)
    );
};


// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

export const errorHandler = (err, req, res, next) => {

    // Already sent a response
    if (res.headersSent) {
        return next(err);
    }

    // Log unexpected errors
    if (!err.isApiError || err.statusCode >= 500) {
        console.error("[ERROR]", {
            message: err.message,
            stack  : err.stack,
            url    : req.originalUrl,
            method : req.method
        });
    }

    // Prisma known request errors
    if (err.code?.startsWith("P")) {
        return res.status(400).json({
            success: false,
            message: "Database operation failed",
            code   : err.code
        });
    }

    const statusCode = err.statusCode || 500;
    const message    = err.message    || "Internal server error";

    return res.status(statusCode).json({
        success: false,
        message,
        ...(err.errors?.length ? { errors: err.errors } : {}),
        ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {})
    });
};
