import { z } from "zod";

export const workflowSchema = z.object({
  workflow_name: z
    .string()
    .trim()
    .min(1, "Workflow name is required.")
    .max(150, "Workflow name must be 150 characters or fewer."),
  workflow_description: z.string().trim(),
  status: z.boolean(),
});
