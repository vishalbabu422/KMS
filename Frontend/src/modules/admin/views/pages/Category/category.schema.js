import { z } from "zod";

export const categorySchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "Category code is required.")
    .max(10, "Category code must be 10 characters or fewer."),
  name: z
    .string()
    .trim()
    .min(1, "Category name is required.")
    .max(255, "Category name must be 255 characters or fewer."),
  parentId: z.string().regex(/^\d+$/, "Select a valid parent category."),
  status: z.boolean(),
});
