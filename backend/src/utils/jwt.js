import jwt from "jsonwebtoken";


// ==========================================
// ACCESS TOKEN
// ==========================================

export const generateAccessToken = (payload) => {

    return jwt.sign(
        payload,
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: "15m"
        }
    );
};


// ==========================================
// REFRESH TOKEN
// ==========================================

export const generateRefreshToken = (payload) => {

    return jwt.sign(
        payload,
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: "7d"
        }
    );
};


// ==========================================
// VERIFY REFRESH TOKEN
// ==========================================

export const verifyRefreshToken = (token) => {

    return jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET
    );
};