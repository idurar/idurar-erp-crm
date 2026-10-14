const Joi = require('joi');
const schema = Joi.object({
  client: Joi.alternatives().try(Joi.string(), Joi.object()).required(),
  number: Joi.number().required(),
  year: Joi.number().required(),
  status: Joi.string().required(),
  notes: Joi.string().allow(''),
  clientVatNumber: Joi.string().allow('').optional(),
  paymentTermsText: Joi.string().allow('').optional(),
  footerText: Joi.string().allow('').optional(),
  expiredDate: Joi.date().required(),
  date: Joi.date().required(),
  // array cannot be empty
  items: Joi.array()
    .items(
      Joi.object({
        _id: Joi.string().allow('').optional(),
        article: Joi.alternatives().try(Joi.string(), Joi.object()).allow(null, '').optional(),
        itemName: Joi.string().required(),
        description: Joi.string().allow(''),
        unit: Joi.string().allow('').optional(),
        discount: Joi.number().min(0).max(100).optional(),
        quantity: Joi.number().required(),
        price: Joi.number().required(),
        total: Joi.number().required(),
      }).required()
    )
    .required(),
  taxRate: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
});

module.exports = schema;
