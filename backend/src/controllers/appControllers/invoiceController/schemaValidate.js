import { object, alternatives, string, number as _number, date as _date, array } from 'joi';
const schema = object({
  client: alternatives().try(string(), object()).required(),
  number: _number().required(),
  year: _number().required(),
  status: string().required(),
  notes: string().allow(''),
  expiredDate: _date().required(),
  date: _date().required(),
  // array cannot be empty
  items: array()
    .items(
      object({
        _id: string().allow('').optional(),
        itemName: string().required(),
        description: string().allow(''),
        quantity: _number().required(),
        price: _number().required(),
        total: _number().required(),
      }).required()
    )
    .required(),
  taxRate: alternatives().try(_number(), string()).required(),
});

export default schema;
