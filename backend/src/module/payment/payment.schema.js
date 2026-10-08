import { z } from "zod";

export const verifyKhaltiPaymentSchema = z.object({
    pidx: z.string().min(1).max(128)
});
