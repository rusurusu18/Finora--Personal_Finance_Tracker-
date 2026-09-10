// ==========================================
// CUSTOM API ERROR
// ==========================================

export class ApiError extends Error {

    constructor(statusCode, message, errors = []) {
        super(message);

        this.statusCode = statusCode;
        this.message    = message;
        this.errors     = errors;
        this.isApiError = true;

        Error.captureStackTrace(this, this.constructor);
    }


    // ── Static helpers ──────────────────────

    static badRequest(message = "Bad Request", errors = []) {
        return new ApiError(400, message, errors);
    }

    static unauthorized(message = "Unauthorized") {
        return new ApiError(401, message);
    }

    static forbidden(message = "Forbidden") {
        return new ApiError(403, message);
    }

    static notFound(message = "Resource not found") {
        return new ApiError(404, message);
    }

    static conflict(message = "Conflict") {
        return new ApiError(409, message);
    }

    static internal(message = "Internal server error") {
        return new ApiError(500, message);
    }
}
