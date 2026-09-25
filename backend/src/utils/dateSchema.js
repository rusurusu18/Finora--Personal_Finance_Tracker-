import { z } from "zod";

export const dateInput = z
  .union([
    z.date(),
    z.string().datetime(),
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD or an ISO datetime"),
  ])
  .transform((value) => new Date(value));
