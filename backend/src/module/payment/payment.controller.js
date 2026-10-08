import * as paymentService from "./payment.service.js";
import { successResponse, createdResponse } from "../../utils/apiResponse.js";

export const getPlusPlan = (req, res) => {
    return successResponse(res, { message: "Plus plan retrieved", data: paymentService.getPlusPlan() });
};

export const initiateEsewaPayment = async (req, res, next) => {
    try {
        const result = await paymentService.initiateEsewaPayment(req.user.id);
        return createdResponse(res, { message: "eSewa checkout created", data: result });
    } catch (error) {
        next(error);
    }
};

export const verifyEsewaPayment = async (req, res, next) => {
    try {
        const result = await paymentService.verifyEsewaPayment(req.user.id, req.body.data);
        return successResponse(res, { message: "eSewa payment verified", data: result });
    } catch (error) {
        next(error);
    }
};

export const initiateKhaltiPayment = async (req, res, next) => {
    try {
        const result = await paymentService.initiateKhaltiPayment(req.user.id);
        return createdResponse(res, { message: "Khalti checkout created", data: result });
    } catch (error) {
        next(error);
    }
};

export const verifyKhaltiPayment = async (req, res, next) => {
    try {
        const result = await paymentService.verifyKhaltiPayment(req.user.id, req.body.pidx);
        return successResponse(res, { message: "Khalti payment verified", data: result });
    } catch (error) {
        next(error);
    }
};