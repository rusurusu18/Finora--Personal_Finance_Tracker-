import { z } from "zod";

export const translateTextSchema = z.object({
    text: z
        .string()
        .trim()
        .min(1, "English text is required")
        .max(5000, "Text must not exceed 5000 characters")
});