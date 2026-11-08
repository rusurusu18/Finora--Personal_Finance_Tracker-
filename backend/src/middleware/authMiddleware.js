// Import jsonwebtoken library to verify JWT authentication tokens
import jwt from "jsonwebtoken";

// Middleware function to authenticate users using JWT access tokens
export const authenticate = (req, res, next) => {
    try {
        // Get the Authorization header from the incoming request
        const authHeader = req.headers.authorization;

        // Check whether the Authorization header is provided
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authentication token is required"
            });
        }

        // Split the Authorization header into two parts: Bearer and token
        const parts = authHeader.split(" ");

        // Validate the authorization format
        // The expected format is: Bearer <token>
        if (
            parts.length !== 2 ||
            parts[0] !== "Bearer"
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format. Use Bearer <token>"
            });
        }

        // Extract the JWT access token from the Authorization header
        const token = parts[1];

        // Verify the token using the secret key stored in environment variables
        // This checks whether the token is valid and has not expired
        const decoded = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET
        );

        // Store the decoded user information in the request object
        // This allows protected routes to access the authenticated user's details
        req.user = decoded;

        // Pass control to the next middleware or route handler
        next();

    } catch (error) {
        // Log authentication errors for debugging purposes
        console.error("Authentication error:", error.message);

        // Check whether the access token has expired
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Access token has expired"
            });
        }

        // Check whether the provided JWT is invalid or malformed
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid access token"
            });
        }

        // Handle any other unexpected authentication errors
        return res.status(401).json({
            success: false,
            message: "Authentication failed"
        });
    }
};