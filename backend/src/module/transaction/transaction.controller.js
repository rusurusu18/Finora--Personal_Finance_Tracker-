import * as transactionService from "./transaction.service.js";
import { successResponse, createdResponse } from "../../utils/apiResponse.js";


export const getTransactions = async (req, res, next) => {
    try {
        const result = await transactionService.getTransactions(req.user.id, req.query);
        return successResponse(res, {
            message: "Transactions retrieved",
            data   : result.transactions,
            meta   : result.meta
        });
    } catch (error) { next(error); }
};

export const getSummary = async (req, res, next) => {
    try {
        const summary = await transactionService.getSummary(req.user.id, req.query);
        return successResponse(res, { message: "Summary retrieved", data: summary });
    } catch (error) { next(error); }
};

export const getTransaction = async (req, res, next) => {
    try {
        const transaction = await transactionService.getTransaction(req.user.id, req.params.id);
        return successResponse(res, { message: "Transaction retrieved", data: transaction });
    } catch (error) { next(error); }
};

export const createTransaction = async (req, res, next) => {
    try {
        const transaction = await transactionService.createTransaction(req.user.id, req.body);
        return createdResponse(res, { message: "Transaction created", data: transaction });
    } catch (error) { next(error); }
};

export const updateTransaction = async (req, res, next) => {
    try {
        const transaction = await transactionService.updateTransaction(req.user.id, req.params.id, req.body);
        return successResponse(res, { message: "Transaction updated", data: transaction });
    } catch (error) { next(error); }
};

export const deleteTransaction = async (req, res, next) => {
    try {
        const result = await transactionService.deleteTransaction(req.user.id, req.params.id);
        return successResponse(res, { message: result.message });
    } catch (error) { next(error); }
};
