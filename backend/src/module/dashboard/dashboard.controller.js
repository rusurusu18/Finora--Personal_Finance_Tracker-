import * as dashboardService from "./dashboard.service.js";
import { successResponse } from "../../utils/apiResponse.js";

// ==========================================
// GET DASHBOARD SUMMARY
// ==========================================

export const getDashboardSummary = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const data = await dashboardService.getDashboardSummary(userId);

        return successResponse(res, {
            message: "Dashboard summary retrieved successfully",
            data
        });
    } catch (error) {
        next(error);
    }
};
