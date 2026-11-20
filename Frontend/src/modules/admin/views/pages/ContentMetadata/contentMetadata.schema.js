import { z } from "zod";

const TEXT_FIELD_TYPES = ["textbox", "text_area"];
const SELECT_FIELD_TYPES = ["dropdown", "checkbox", "multiple_dropdown"];
const FIELD_TYPES = [...TEXT_FIELD_TYPES, ...SELECT_FIELD_TYPES, "date"];
const MODULE_SELECT_VALUES = [
  "AudienceMasters",
  "CategoryMasters",
  "custom",
  "LanguageMasters",
  "OrganisationMasters",
  "TypeMasters",
];
const MULTIPLE_DROPDOWN_VALUES = ["CategoryMasters", "OrganisationMasters"];

export const contentMetadataSchema = z
  .object({
    contentTypeId: z
      .string()
      .trim()
      .min(1, "Content type is required.")
      .refine(
        (value) =>
          value === "" ||
          (/^\d+$/.test(value) &&
            Number(value) > 0 &&
            Number.isSafeInteger(Number(value))),
        "Select a valid content type.",
      ),
    title: z
      .string()
      .trim()
      .min(1, "Field title is required.")
      .max(255, "Field title must be 255 characters or fewer."),
    titleHindi: z
      .string()
      .trim()
      .max(255, "Field title (Hindi) must be 255 characters or fewer."),
    description: z.string().trim().min(1, "Field description is required."),
    descriptionHindi: z.string().trim(),
    type: z
      .string()
      .refine((value) => FIELD_TYPES.includes(value), "Select a valid field type."),
    maxLength: z.string().trim(),
    typeData: z.string(),
    customValues: z.string(),
    isMandatory: z.boolean(),
    priority: z
      .string()
      .trim()
      .min(1, "Priority is required.")
      .refine(
        (value) =>
          /^\d+$/.test(value) &&
          Number.isSafeInteger(Number(value)) &&
          Number(value) > 0,
        "Priority must be a number.",
      ),
    status: z.boolean(),
  })
  .superRefine((form, context) => {
    if (
      TEXT_FIELD_TYPES.includes(form.type) &&
      form.maxLength &&
      (!/^\d+$/.test(form.maxLength) ||
        !Number.isSafeInteger(Number(form.maxLength)))
    ) {
      context.addIssue({
        code: "custom",
        path: ["maxLength"],
        message: "Max length must be a non-negative whole number.",
      });
    }

    if (
      SELECT_FIELD_TYPES.includes(form.type) &&
      !MODULE_SELECT_VALUES.includes(form.typeData)
    ) {
      context.addIssue({
        code: "custom",
        path: ["typeData"],
        message: "Select a dropdown source.",
      });
    } else if (
      form.type === "multiple_dropdown" &&
      !MULTIPLE_DROPDOWN_VALUES.includes(form.typeData)
    ) {
      context.addIssue({
        code: "custom",
        path: ["typeData"],
        message: "Select a valid multiple dropdown source.",
      });
    }
  });
