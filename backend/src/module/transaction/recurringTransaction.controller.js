import * as recurringTransactionService from "./recurringTransaction.service.js";
import { successResponse, createdResponse } from "../../utils/apiResponse.js";

export const getRecurringTransactions = async (req, res, next) => {
    try {
        const schedules = await recurringTransactionService.getRecurringTransactions(req.user.id);
        return successResponse(res, {
            message: "Recurring transactions retrieved",
            data: schedules
        });
    } catch (error) { next(error); }
};

export const createRecurringTransaction = async (req, res, next) => {
    try {
        const schedule = await recurringTransactionService.createRecurringTransaction(req.user.id, req.body);
        return createdResponse(res, {
            message: "Recurring transaction created",
            data: schedule
        });
    } catch (error) { next(error); }
};

export const updateRecurringTransaction = async (req, res, next) => {
    try {
        const schedule = await recurringTransactionService.updateRecurringTransaction(
            req.user.id,
            req.params.id,
            req.body
        );
        return successResponse(res, {
            message: "Recurring transaction updated",
            data: schedule
        });
    } catch (error) { next(error); }
};

export const deleteRecurringTransaction = async (req, res, next) => {
    try {
        const result = await recurringTransactionService.deleteRecurringTransaction(
            req.user.id,
            req.params.id
        );
        return successResponse(res, { message: result.message });
    } catch (error) { next(error); }
};
