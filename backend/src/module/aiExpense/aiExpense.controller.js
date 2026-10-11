import { successResponse } from "../../utils/apiResponse.js";
import * as aiExpenseService from "./aiExpense.service.js";

export const parseExpense = async (req, res, next) => {
    try {
        const expense = await aiExpenseService.parseExpense(req.body);
        return successResponse(res, { message: "Expense parsed", data: expense });
    } catch (error) {
        next(error);
    }
};

export const getFinancialInsights = async (req, res, next) => {
    try {
        const insights = await aiExpenseService.getFinancialInsights(req.user.id);
        return successResponse(res, { message: "Financial insights generated", data: insights });
    } catch (error) {
        next(error);
    }
};
