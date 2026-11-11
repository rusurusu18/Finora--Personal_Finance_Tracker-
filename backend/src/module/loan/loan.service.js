// Import Prisma client to interact with the database
import prisma from "../../config/database.js";

// Import ApiError to handle custom API errors
import { ApiError } from "../../utils/apiError.js";


// Helper function to round currency values to two decimal places
const roundCurrency = (value) =>
    Math.round((value + Number.EPSILON) * 100) / 100;


// Calculate monthly EMI, total payment, and total interest for a loan
export const calculateLoan = ({ principal, annualInterestRate, termMonths }) => {

    // Convert the annual interest rate (percentage) into a monthly decimal rate
    // Example: 12% annual interest = 12 / 1200 = 0.01 monthly rate
    const monthlyRate = annualInterestRate / 1200;

    // Calculate the monthly EMI using the standard loan repayment formula
    // If the interest rate is 0, divide the principal equally across all months
    const monthlyPayment = monthlyRate === 0
        ? principal / termMonths
        : principal * monthlyRate * (1 + monthlyRate) ** termMonths
            / ((1 + monthlyRate) ** termMonths - 1);

    // Round the monthly EMI to two decimal places
    const roundedPayment = roundCurrency(monthlyPayment);

    // Calculate the total amount payable over the entire loan period
    const totalPayment = roundCurrency(monthlyPayment * termMonths);

    // Calculate the total interest by subtracting the principal
    // Math.max(0, ...) prevents the interest amount from becoming negative
    return {
        monthlyPayment: roundedPayment,
        totalPayment,
        totalInterest: roundCurrency(Math.max(0, totalPayment - principal))
    };
};


// Retrieve all loan plans belonging to a specific user
export const getLoanPlans = async (userId) => prisma.loanPlan.findMany({
    // Fetch only loan plans created by the given user
    where: { userId },

    // Display the newest loan plans first
    orderBy: { createdAt: "desc" }
});


// Create and save a new loan plan for the logged-in user
export const createLoanPlan = async (userId, data) => {

    // Calculate EMI, total payment, and total interest using the provided loan details
    const calculation = calculateLoan(data);

    // Save the loan plan and its calculated financial details in the database
    return prisma.loanPlan.create({
        data: {
            userId,                              // ID of the user creating the loan plan
            name: data.name,                    // Name or title of the loan plan
            principal: data.principal,          // Original loan amount
            annualInterestRate: data.annualInterestRate, // Annual interest rate in percentage
            termMonths: data.termMonths,        // Loan repayment period in months
            ...calculation                      // Include calculated EMI and payment details
        }
    });
};


// Delete a specific loan plan belonging to the logged-in user
export const deleteLoanPlan = async (userId, loanPlanId) => {

    // Delete the loan plan only if its ID and user ID both match
    // This prevents users from deleting loan plans belonging to others
    const result = await prisma.loanPlan.deleteMany({
        where: { id: loanPlanId, userId }
    });

    // If no record was deleted, the loan plan was not found for this user
    if (!result.count) {
        throw ApiError.notFound("Loan plan not found");
    }

    // Return a confirmation message after successful deletion
    return { message: "Loan plan deleted successfully" };
};