import { z } from "zod";

export const typeSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "Type code is required.")
    .max(6, "Type code must be 6 characters or fewer."),
  name: z
    .string()
    .trim()
    .min(1, "Type name is required.")
    .max(255, "Type name must be 255 characters or fewer."),
  status: z.boolean(),
});
