import * as userService from "./user.service.js";
import { successResponse } from "../../utils/apiResponse.js";


// ==========================================
// GET MY PROFILE
// ==========================================

export const getMe = async (req, res, next) => {
    try {
        const user = await userService.getMe(req.user.id);
        return successResponse(res, { message: "Profile retrieved", data: user });
    } catch (error) {
        next(error);
    }
};


// ==========================================
// UPDATE MY PROFILE
// ==========================================

export const updateMe = async (req, res, next) => {
    try {
        const user = await userService.updateMe(req.user.id, req.body);
        return successResponse(res, { message: "Profile updated", data: user });
    } catch (error) {
        next(error);
    }
};


// ==========================================
// DELETE MY ACCOUNT
// ==========================================

export const deleteMe = async (req, res, next) => {
    try {
        const result = await userService.deleteMe(req.user.id);
        return successResponse(res, { message: result.message });
    } catch (error) {
        next(error);
    }
};
