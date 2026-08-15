const Joi = require('joi');
const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  phone: Joi.string().allow(''),
  country: Joi.string().allow(''),
  address: Joi.string().allow(''),
});

module.exports = schema;
