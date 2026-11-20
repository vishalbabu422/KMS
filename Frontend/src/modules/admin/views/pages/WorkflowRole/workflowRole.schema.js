import { z } from "zod";

export const workflowRoleSchema = z.object({
  role_name: z
    .string()
    .trim()
    .min(1, "Role name is required.")
    .max(150, "Role name must be 150 characters or fewer."),
  status: z.boolean(),
});
