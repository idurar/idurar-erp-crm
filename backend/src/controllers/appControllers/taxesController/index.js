const mongoose = require('mongoose');
const Model = mongoose.model('Taxes');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const methods = createCRUDController('Taxes');

delete methods['delete'];

methods.create = async (req, res) => {
  const { isDefault } = req.body;

  if (isDefault) {
    await Model.updateMany({}, { isDefault: false });
  }

  const countDefault = await Model.countDocuments({
    isDefault: true,
  });

  const result = await new Model({
    ...req.body,

    isDefault: countDefault < 1 ? true : false,
  }).save();

  return res.status(200).json({
    success: true,
    result: result,
    message: 'Tax created successfully',
  });
};

methods.delete = async (req, res) => {
  return res.status(403).json({
    success: false,
    result: null,
    message: "you can't delete tax after it has been created",
  });
};

methods.update = async (req, res) => {
  const { id } = req.params;
  const paymentMode = await Model.findOne({
    _id: req.params.id,
    removed: false,
  }).exec();
  const { isDefault = paymentMode.isDefault, enabled = paymentMode.enabled } = req.body;

  // Fetch the existing default payment mode
  const existingDefault = await Model.findOne({ isDefault: true });

  // If the requested mode is being enabled and it's not already set as default,
  // and there is no other default mode, we set it as default.
  if (!isDefault && enabled && !existingDefault) {
    await Model.findOneAndUpdate({ _id: id }, { isDefault: true });
  }

  // If the requested mode is being set as default and there is an existing default mode,
  // we make sure to unset the default status of the existing default mode.
  if (isDefault && existingDefault && existingDefault._id.toString() !== id) {
    await Model.updateMany({ isDefault: true }, { isDefault: false });
  }

  // Update the payment mode
  const result = await Model.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });

  return res.status(200).json({
    success: true,
    message: 'paymentMode updated successfully',
    result,
  });
};

module.exports = methods;
