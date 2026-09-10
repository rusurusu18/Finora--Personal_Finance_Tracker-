import * as goalService from "./goal.service.js";
import { successResponse, createdResponse } from "../../utils/apiResponse.js";


export const getGoals = async (req, res, next) => {
    try {
        const { status } = req.query;
        const goals = await goalService.getGoals(req.user.id, status);
        return successResponse(res, { message: "Goals retrieved", data: goals });
    } catch (error) { next(error); }
};

export const getGoal = async (req, res, next) => {
    try {
        const goal = await goalService.getGoal(req.user.id, req.params.id);
        return successResponse(res, { message: "Goal retrieved", data: goal });
    } catch (error) { next(error); }
};

export const createGoal = async (req, res, next) => {
    try {
        const goal = await goalService.createGoal(req.user.id, req.body);
        return createdResponse(res, { message: "Goal created", data: goal });
    } catch (error) { next(error); }
};

export const updateGoal = async (req, res, next) => {
    try {
        const goal = await goalService.updateGoal(req.user.id, req.params.id, req.body);
        return successResponse(res, { message: "Goal updated", data: goal });
    } catch (error) { next(error); }
};

export const depositToGoal = async (req, res, next) => {
    try {
        const goal = await goalService.depositToGoal(req.user.id, req.params.id, req.body.amount);
        return successResponse(res, { message: "Deposit successful", data: goal });
    } catch (error) { next(error); }
};

export const deleteGoal = async (req, res, next) => {
    try {
        const result = await goalService.deleteGoal(req.user.id, req.params.id);
        return successResponse(res, { message: result.message });
    } catch (error) { next(error); }
};
