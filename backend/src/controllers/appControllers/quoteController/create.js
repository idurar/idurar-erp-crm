const mongoose = require('mongoose');
const Model = mongoose.model('Quote');
const { calculate } = require('@/helpers');
const { increaseBySettingKey } = require('@/middlewares/settings');

const create = async (req, res) => {
  let body = req.body;

  const { items = [], taxRate = 0, discount = 0 } = body;

  if (items.length === 0) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Items cannot be empty',
    });
  }

  let subTotal = 0;
  let taxTotal = 0;
  let total = 0;

  items.map((item) => {
    let itemTotal = calculate.multiply(item['quantity'], item['price']);
    subTotal = calculate.add(subTotal, itemTotal);
    item['total'] = itemTotal;
  });

  taxTotal = calculate.multiply(subTotal, taxRate / 100);
  total = calculate.add(subTotal, taxTotal);

  body['subTotal'] = subTotal;
  body['taxTotal'] = taxTotal;
  body['total'] = total;
  body['items'] = items;
  body['createdBy'] = req.admin._id;

  const result = await new Model(body).save();

  increaseBySettingKey({
    settingKey: 'last_quote_number',
  });

  return res.status(200).json({
    success: true,
    result,
    message: 'Quote created successfully',
  });
};

module.exports = create;