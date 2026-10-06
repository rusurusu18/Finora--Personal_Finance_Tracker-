import { z } from "zod";

export const parseExpenseSchema = z.object({
    text: z.string().trim().min(3).max(500),
    categories: z.array(z.string().trim().min(1).max(80)).max(100),
    currentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
});
