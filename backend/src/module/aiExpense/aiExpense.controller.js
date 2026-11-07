// Import the utility function to send standardized success responses
import { successResponse } from "../../utils/apiResponse.js";

// Import all functions from the AI expense service
import * as aiExpenseService from "./aiExpense.service.js";

// Controller function to extract expense details from the provided input
export const parseExpense = async (req, res, next) => {
    try {
        // Pass the request body to the service to identify and extract expense details
        const expense = await aiExpenseService.parseExpense(req.body);

        // Return a successful response containing the parsed expense details
        return successResponse(res, {
            message: "Expense parsed",
            data: expense
        });
    } catch (error) {
        // Pass any error to the centralized Express error-handling middleware
        next(error);
    }
};

// Controller function to generate financial insights for the logged-in user
export const getFinancialInsights = async (req, res, next) => {
    try {
        // Get the logged-in user's ID and pass it to the service
        // to analyze their financial data and generate insights
        const insights = await aiExpenseService.getFinancialInsights(req.user.id);

        // Return a successful response containing the generated financial insights
        return successResponse(res, {
            message: "Financial insights generated",
            data: insights
        });
    } catch (error) {
        // Pass any error to the centralized Express error-handling middleware
        next(error);
    }
};