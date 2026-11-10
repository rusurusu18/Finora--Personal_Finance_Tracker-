// Import response utility functions to send standardized API responses
import { createdResponse, successResponse } from "../../utils/apiResponse.js";

// Import all loan-related functions from the loan service
import * as loanService from "./loan.service.js";


// Controller function to retrieve all loan plans of the logged-in user
export const getLoanPlans = async (req, res, next) => {
    try {
        // Get the logged-in user's ID and fetch their loan plans
        const plans = await loanService.getLoanPlans(req.user.id);

        // Return a successful response containing the retrieved loan plans
        return successResponse(res, {
            message: "Loan plans retrieved",
            data: plans
        });
    } catch (error) {
        // Pass any error to the centralized Express error-handling middleware
        next(error);
    }
};


// Controller function to create and save a new loan plan
export const createLoanPlan = async (req, res, next) => {
    try {
        // Get the logged-in user's ID and loan details submitted in the request body
        // Pass them to the service to create a new loan plan
        const plan = await loanService.createLoanPlan(req.user.id, req.body);

        // Return a 201 Created response containing the newly saved loan plan
        return createdResponse(res, {
            message: "Loan plan saved",
            data: plan
        });
    } catch (error) {
        // Pass any error to the centralized Express error-handling middleware
        next(error);
    }
};


// Controller function to delete a specific loan plan
export const deleteLoanPlan = async (req, res, next) => {
    try {
        // Get the logged-in user's ID and loan plan ID from the URL parameters
        // Pass them to the service to delete the selected loan plan
        const result = await loanService.deleteLoanPlan(req.user.id, req.params.id);

        // Return a successful response with the deletion confirmation message
        return successResponse(res, {
            message: result.message
        });
    } catch (error) {
        // Pass any error to the centralized Express error-handling middleware
        next(error);
    }
};