const Joi = require("joi");

const userRolePermListQuerySchema = Joi.object({
  role_id: Joi.number().integer().required(),
});

module.exports = {
  userRolePermListQuerySchema,
};
