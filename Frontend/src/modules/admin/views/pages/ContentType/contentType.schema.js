import { z } from "zod";

export const contentTypeSchema = z.object({
  contentType: z
    .string()
    .refine(
      (value) => ["Folderish", "NonFile", "File"].includes(value),
      "Select a valid content type.",
    ),
  code: z
    .string()
    .trim()
    .min(1, "Content code is required.")
    .max(100, "Content code must be 100 characters or fewer."),
  name: z
    .string()
    .trim()
    .min(1, "Content name is required.")
    .max(255, "Content name must be 255 characters or fewer."),
  nameHindi: z
    .string()
    .trim()
    .max(255, "Content name (Hindi) must be 255 characters or fewer."),
  description: z
    .string()
    .trim()
    .min(1, "Content description is required.")
    .max(500, "Content description must be 500 characters or fewer."),
  workflowId: z
    .string()
    .refine((value) => ["1", "2"].includes(value), "Select a valid workflow."),
  status: z.boolean(),
});
