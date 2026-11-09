// Import all budget-related functions from the budget service
import * as budgetService from "./budget.service.js";

// Import response utility functions for sending standardized API responses
import { successResponse, createdResponse } from "../../utils/apiResponse.js";


// Controller function to retrieve all budgets of the logged-in user
export const getBudgets = async (req, res, next) => {
    try {
        // Get the logged-in user's ID and fetch their budgets from the service
        const budgets = await budgetService.getBudgets(req.user.id);

        // Return a successful response containing all retrieved budgets
        return successResponse(res, {
            message: "Budgets retrieved",
            data: budgets
        });
    } catch (error) {
        // Pass any error to the centralized Express error-handling middleware
        next(error);
    }
};


// Controller function to retrieve a specific budget by its ID
export const getBudget = async (req, res, next) => {
    try {
        // Get the user's ID and budget ID from the request parameters
        // Fetch the specific budget belonging to the logged-in user
        const budget = await budgetService.getBudget(req.user.id, req.params.id);

        // Return a successful response containing the retrieved budget
        return successResponse(res, {
            message: "Budget retrieved",
            data: budget
        });
    } catch (error) {
        // Forward any error to the centralized error-handling middleware
        next(error);
    }
};


// Controller function to create a new budget for the logged-in user
export const createBudget = async (req, res, next) => {
    try {
        // Get the user's ID and budget details submitted in the request body
        // Pass them to the service to create a new budget
        const budget = await budgetService.createBudget(req.user.id, req.body);

        // Return a 201 Created response with the newly created budget
        return createdResponse(res, {
            message: "Budget created",
            data: budget
        });
    } catch (error) {
        // Forward any error to the centralized error-handling middleware
        next(error);
    }
};


// Controller function to update an existing budget
export const updateBudget = async (req, res, next) => {
    try {
        // Get the logged-in user's ID, budget ID, and updated details
        // Pass them to the service to update the selected budget
        const budget = await budgetService.updateBudget(
            req.user.id,
            req.params.id,
            req.body
        );

        // Return a successful response containing the updated budget
        return successResponse(res, {
            message: "Budget updated",
            data: budget
        });
    } catch (error) {
        // Forward any error to the centralized error-handling middleware
        next(error);
    }
};


// Controller function to delete a specific budget
export const deleteBudget = async (req, res, next) => {
    try {
        // Get the logged-in user's ID and the budget ID from the URL
        // Call the service to delete the selected budget
        const result = await budgetService.deleteBudget(req.user.id, req.params.id);

        // Return a successful response with the deletion confirmation message
        return successResponse(res, {
            message: result.message
        });
    } catch (error) {
        // Forward any error to the centralized error-handling middleware
        next(error);
    }
};