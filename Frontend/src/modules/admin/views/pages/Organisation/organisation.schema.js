import { z } from "zod";

export const organisationSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "Organisation code is required.")
    .max(12, "Organisation code must be 12 characters or fewer."),
  name: z
    .string()
    .trim()
    .min(1, "Organisation name is required.")
    .max(255, "Organisation name must be 255 characters or fewer."),
  parentId: z.string().regex(/^\d+$/, "Select a valid parent organisation."),
  status: z.boolean(),
});
