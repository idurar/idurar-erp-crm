const mongoose = require('mongoose');
const { calculate } = require('@/helpers');
const { increaseBySettingKey } = require('@/middlewares/settings');
const schema = require('./schemaValidate');

const Quote = mongoose.model('Quote');

const create = async (req, res) => {
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      result: null,
      message: error.details[0]?.message,
    });
  }

  if (value.items.length === 0) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Items cannot be empty',
    });
  }

  let subTotal = 0;
  const items = value.items.map((item) => {
    const total = calculate.multiply(calculate.multiply(item.quantity, item.price), 1 - (Number(item.discount) || 0) / 100);
    subTotal = calculate.add(subTotal, total);
    return { ...item, total };
  });
  const taxTotal = calculate.multiply(subTotal, Number(value.taxRate) / 100);
  const total = calculate.add(subTotal, taxTotal);

  const result = await new Quote({
    ...value,
    items,
    subTotal,
    taxTotal,
    total,
    createdBy: req.admin._id,
  }).save();

  const pdf = `quote-${result._id}.pdf`;
  result.pdf = pdf;
  await result.save();
  await increaseBySettingKey({ settingKey: 'last_quote_number' });

  return res.status(200).json({
    success: true,
    result,
    message: 'Quote created successfully',
  });
};

module.exports = create;
