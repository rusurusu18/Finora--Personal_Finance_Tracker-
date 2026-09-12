import * as dashboardService from "./dashboard.service.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/apiError.js";

// ==========================================
// GET DASHBOARD SUMMARY
// ==========================================

export const getDashboardSummary = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const data = await dashboardService.getDashboardSummary(userId);

        return res.status(200).json(
            apiResponse("Dashboard summary retrieved successfully", data)
        );
    } catch (error) {
        next(error);
    }
};
