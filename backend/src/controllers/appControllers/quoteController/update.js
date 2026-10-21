const mongoose = require('mongoose');
const { calculate } = require('@/helpers');
const schema = require('./schemaValidate');

const Quote = mongoose.model('Quote');

const update = async (req, res) => {
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

  const quote = await Quote.findOne({ _id: req.params.id, removed: false });
  if (!quote) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No document found',
    });
  }
  if (quote.converted?.invoice || quote.converted?.orderConfirmation) {
    return res.status(409).json({
      success: false,
      result: null,
      message: 'Ein bereits umgewandeltes Angebot kann nicht mehr geändert werden.',
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

  Object.assign(quote, value, { items, subTotal, taxTotal, total });
  const result = await quote.save();

  return res.status(200).json({
    success: true,
    result,
    message: 'Quote updated successfully',
  });
};

module.exports = update;
