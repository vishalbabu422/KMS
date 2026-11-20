import { z } from "zod";

export const languageSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "Language code is required.")
    .max(7, "Language code must be 7 characters or fewer."),
  name: z
    .string()
    .trim()
    .min(1, "Language name is required.")
    .max(255, "Language name must be 255 characters or fewer."),
  status: z.boolean(),
});
