import { z } from "zod";

export const audienceSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "Audience code is required.")
    .max(6, "Audience code must be 6 characters or fewer."),
  name: z
    .string()
    .trim()
    .min(1, "Audience name is required.")
    .max(255, "Audience name must be 255 characters or fewer."),
  status: z.boolean(),
});
