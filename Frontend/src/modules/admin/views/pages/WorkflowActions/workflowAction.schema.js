import { z } from "zod";

export const workflowActionSchema = z.object({
  action_name: z
    .string()
    .trim()
    .min(1, "Action name is required.")
    .max(150, "Action name must be 150 characters or fewer."),
  status: z.boolean(),
});
