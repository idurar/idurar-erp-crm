import mongoose from 'mongoose';

const Model = mongoose.model('Offer');

import custom from '#controllers/pdfController/index.js';

import { calculate } from '#helpers.js';
import { increaseBySettingKey } from '#middlewares/settings/index.js';

const create = async (req, res) => {
  const { items = [], taxRate = 0, discount = 0 } = req.body;

  // default
  let subTotal = 0;
  let taxTotal = 0;
  let total = 0;
  // let credit = 0;

  //Calculate the items array with subTotal, total, taxTotal
  items.map((item) => {
    const total = calculate.multiply(item.quantity, item.price);
    //sub total
    subTotal = calculate.add(subTotal, total);
    //item total
    item.total = total;
  });
  taxTotal = calculate.multiply(subTotal, taxRate / 100);
  total = calculate.add(subTotal, taxTotal);

  const body = {
    ...req.body,
    subTotal,
    taxTotal,
    total,
    items,
    createdBy: req.admin._id,
  };

  // Creating a new document in the collection
  const result = await new Model(body).save();
  const fileId = `offer-${result._id}.pdf`;
  const updateResult = await Model.findOneAndUpdate(
    { _id: result._id },
    { pdf: fileId },
    {
      new: true,
    }
  ).exec();
  // Returning successfull response

  increaseBySettingKey({ settingKey: 'last_offer_number' });

  // Returning successfull response
  return res.status(200).json({
    success: true,
    result: updateResult,
    message: 'Offer created successfully',
  });
};

export default create;
