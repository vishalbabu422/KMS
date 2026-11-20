const Joi = require("joi");

const getOrganisationByIdParamsSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "any.required": "Please provide organisation ID.",
      "number.integer": "Organisation ID must be a valid number.",
      "number.positive": "Organisation ID must be greater than zero."
    }),
});

module.exports = {
  getOrganisationByIdParamsSchema,
};
