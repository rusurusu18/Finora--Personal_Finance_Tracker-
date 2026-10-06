import { z } from "zod";

export const createLoanPlanSchema = z.object({
    name: z.string().trim().min(1).max(100),
    principal: z.number().finite().positive().max(9999999999999),
    annualInterestRate: z.number().finite().min(0).max(100),
    termMonths: z.number().int().min(1).max(600)
});
