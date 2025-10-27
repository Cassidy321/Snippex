const Joi = require("joi");

const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(50).required().messages({
    "string.alphanum": "Username must only contain alphanumeric characters",
    "string.min": "Username too short (3 characters minimum)",
    "string.max": "Username too long (50 characters maximum)",
    "any.required": "Username is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(8).max(128).required().messages({
    "string.min": "Password too short (8 characters minimum)",
    "string.max": "Password too long (128 characters maximum)",
    "any.required": "Password is required",
  }),
});

const validateRegister = (data) => {
  return registerSchema.validate(data, { abortEarly: false });
};

module.exports = {
  validateRegister,
};
