import * as accountService from "./account.service.js";
import { successResponse, createdResponse } from "../../utils/apiResponse.js";


// ==========================================
// LIST ACCOUNTS
// ==========================================

export const getAccounts = async (req, res, next) => {
    try {
        const result = await accountService.getAccounts(req.user.id);
        return successResponse(res, { message: "Accounts retrieved", data: result });
    } catch (error) {
        next(error);
    }
};


// ==========================================
// GET SINGLE ACCOUNT
// ==========================================

export const getAccount = async (req, res, next) => {
    try {
        const account = await accountService.getAccount(req.user.id, req.params.id);
        return successResponse(res, { message: "Account retrieved", data: account });
    } catch (error) {
        next(error);
    }
};


// ==========================================
// CREATE ACCOUNT
// ==========================================

export const createAccount = async (req, res, next) => {
    try {
        const account = await accountService.createAccount(req.user.id, req.body);
        return createdResponse(res, { message: "Account created", data: account });
    } catch (error) {
        next(error);
    }
};


// ==========================================
// UPDATE ACCOUNT
// ==========================================

export const updateAccount = async (req, res, next) => {
    try {
        const account = await accountService.updateAccount(req.user.id, req.params.id, req.body);
        return successResponse(res, { message: "Account updated", data: account });
    } catch (error) {
        next(error);
    }
};


// ==========================================
// DELETE ACCOUNT
// ==========================================

export const deleteAccount = async (req, res, next) => {
    try {
        const result = await accountService.deleteAccount(req.user.id, req.params.id);
        return successResponse(res, { message: result.message });
    } catch (error) {
        next(error);
    }
};
