import { createdResponse, successResponse } from "../../utils/apiResponse.js";
import * as loanService from "./loan.service.js";

export const getLoanPlans = async (req, res, next) => {
    try {
        const plans = await loanService.getLoanPlans(req.user.id);
        return successResponse(res, { message: "Loan plans retrieved", data: plans });
    } catch (error) {
        next(error);
    }
};

export const createLoanPlan = async (req, res, next) => {
    try {
        const plan = await loanService.createLoanPlan(req.user.id, req.body);
        return createdResponse(res, { message: "Loan plan saved", data: plan });
    } catch (error) {
        next(error);
    }
};

export const deleteLoanPlan = async (req, res, next) => {
    try {
        const result = await loanService.deleteLoanPlan(req.user.id, req.params.id);
        return successResponse(res, { message: result.message });
    } catch (error) {
        next(error);
    }
};
