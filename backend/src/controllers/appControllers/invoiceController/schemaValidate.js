const Joi = require('joi');
const schema = Joi.object({
  client: Joi.alternatives().try(Joi.string(), Joi.object()).required(),
  number: Joi.number().integer().positive().optional(),
  year: Joi.number().integer().min(2000).max(2200).optional(),
  status: Joi.string().valid('draft').default('draft'),
  notes: Joi.string().allow(''),
  clientVatNumber: Joi.string().allow('').optional(),
  paymentTermsText: Joi.string().allow('').optional(),
  footerText: Joi.string().allow('').optional(),
  recurring: Joi.string()
    .valid('none', 'weekly', 'monthly', 'quarterly', 'annually')
    .default('none'),
  recurringActive: Joi.boolean().default(false),
  nextRecurringDate: Joi.date().allow(null).optional(),
  recurringEndDate: Joi.date().allow(null).optional(),
  expiredDate: Joi.date().min(Joi.ref('date')).required(),
  date: Joi.date().required(),
  serviceDate: Joi.date().required(),
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
        quantity: Joi.number().positive().required(),
        price: Joi.number().min(0).required(),
        total: Joi.number().required(),
      }).required()
    )
    .min(1)
    .required(),
  taxRate: Joi.number().min(0).max(100).required(),
});

module.exports = schema;
