import rateLimit from "express-rate-limit";


// ==========================================
// HELPERS
// ==========================================

const rateLimitHandler = (req, res) => {
    return res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later."
    });
};


// ==========================================
// GENERAL API LIMITER
// ==========================================

export const generalLimiter = rateLimit({
    windowMs         : 15 * 60 * 1000, // 15 minutes
    max              : 200,
    standardHeaders  : true,
    legacyHeaders    : false,
    handler          : rateLimitHandler
});


// ==========================================
// AUTH LIMITER (strict)
// ==========================================

export const authLimiter = rateLimit({
    windowMs         : 15 * 60 * 1000, // 15 minutes
    max              : 20,
    standardHeaders  : true,
    legacyHeaders    : false,
    handler          : rateLimitHandler
});


// ==========================================
// FORGOT PASSWORD LIMITER (very strict)
// ==========================================

export const forgotPasswordLimiter = rateLimit({
    windowMs         : 60 * 60 * 1000, // 1 hour
    max              : 5,
    standardHeaders  : true,
    legacyHeaders    : false,
    handler          : rateLimitHandler
});
