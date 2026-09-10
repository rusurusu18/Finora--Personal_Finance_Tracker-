// ==========================================
// STANDARD API RESPONSE
// ==========================================

export const successResponse = (res, {
    statusCode = 200,
    message    = "Success",
    data       = null,
    meta       = null
} = {}) => {

    const body = {
        success: true,
        message
    };

    if (data !== null) body.data = data;
    if (meta !== null) body.meta = meta;

    return res.status(statusCode).json(body);
};


export const createdResponse = (res, { message = "Created successfully", data = null } = {}) => {
    return successResponse(res, { statusCode: 201, message, data });
};
