import prisma from "../../config/database.js";
import { ApiError } from "../../utils/apiError.js";

const roundCurrency = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

export const calculateLoan = ({ principal, annualInterestRate, termMonths }) => {
    const monthlyRate = annualInterestRate / 1200;
    const monthlyPayment = monthlyRate === 0
        ? principal / termMonths
        : principal * monthlyRate * (1 + monthlyRate) ** termMonths
            / ((1 + monthlyRate) ** termMonths - 1);
    const roundedPayment = roundCurrency(monthlyPayment);
    const totalPayment = roundCurrency(roundedPayment * termMonths);

    return {
        monthlyPayment: roundedPayment,
        totalPayment,
        totalInterest: roundCurrency(totalPayment - principal)
    };
};

export const getLoanPlans = async (userId) => prisma.loanPlan.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
});

export const createLoanPlan = async (userId, data) => {
    const calculation = calculateLoan(data);

    return prisma.loanPlan.create({
        data: {
            userId,
            name: data.name,
            principal: data.principal,
            annualInterestRate: data.annualInterestRate,
            termMonths: data.termMonths,
            ...calculation
        }
    });
};

export const deleteLoanPlan = async (userId, loanPlanId) => {
    const result = await prisma.loanPlan.deleteMany({
        where: { id: loanPlanId, userId }
    });

    if (!result.count) throw ApiError.notFound("Loan plan not found");

    return { message: "Loan plan deleted successfully" };
};
