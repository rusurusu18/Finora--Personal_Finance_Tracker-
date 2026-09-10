import * as budgetService from "./budget.service.js";
import { successResponse, createdResponse } from "../../utils/apiResponse.js";


export const getBudgets = async (req, res, next) => {
    try {
        const budgets = await budgetService.getBudgets(req.user.id);
        return successResponse(res, { message: "Budgets retrieved", data: budgets });
    } catch (error) { next(error); }
};

export const getBudget = async (req, res, next) => {
    try {
        const budget = await budgetService.getBudget(req.user.id, req.params.id);
        return successResponse(res, { message: "Budget retrieved", data: budget });
    } catch (error) { next(error); }
};

export const createBudget = async (req, res, next) => {
    try {
        const budget = await budgetService.createBudget(req.user.id, req.body);
        return createdResponse(res, { message: "Budget created", data: budget });
    } catch (error) { next(error); }
};

export const updateBudget = async (req, res, next) => {
    try {
        const budget = await budgetService.updateBudget(req.user.id, req.params.id, req.body);
        return successResponse(res, { message: "Budget updated", data: budget });
    } catch (error) { next(error); }
};

export const deleteBudget = async (req, res, next) => {
    try {
        const result = await budgetService.deleteBudget(req.user.id, req.params.id);
        return successResponse(res, { message: result.message });
    } catch (error) { next(error); }
};
