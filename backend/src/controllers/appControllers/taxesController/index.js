import mongoose from 'mongoose';
import Taxes from '#models/appModels/Taxes.js';
const Model = mongoose.model('Taxes');
import createCRUDController from '#controllers/middlewaresControllers/createCRUDController/index.js';

const methods = createCRUDController('Taxes');

delete methods['delete'];

methods.create = async (req, res) => {
  const { isDefault } = req.body;

  if (isDefault) {
    await Model.updateMany({}, { isDefault: false });
  }
  const result = await new Model(req.body).save();
  return res.status(200).json({
    success: true,
    result: result,
    message: 'Tax created successfully',
  });
};

methods.update = async (req, res) => {
  const { id } = req.params;
  const tax = await Model.findById(id);
  const { isDefault = tax.isDefault, enabled = tax.enabled } = req.body;

  // if isDefault:false , we update first - isDefault:true
  // if enabled:false and isDefault:true , we update first - isDefault:true
  if (!isDefault || (!enabled && isDefault)) {
    await Model.findOneAndUpdate({ _id: { $ne: id }, enabled: true }, { isDefault: true });
  }

  // if isDefault:true and enabled:true, we update other taxes and make is isDefault:false
  if (isDefault && enabled) {
    await Model.updateMany({ _id: { $ne: id } }, { isDefault: false });
  }

  const taxesCount = await Model.estimatedDocumentCount();

  // if enabled:false and it's only one exist, we can't disable
  if (!enabled && taxesCount <= 1) {
    return res.status(422).json({
      success: false,
      result: null,
      message: 'You cannot disable the tax because it is the only existing one',
    });
  }

  const result = await Model.findOneAndUpdate({ _id: id }, req.body, { new: true });

  return res.status(200).json({
    success: true,
    message: 'Tax updated successfully',
    result,
  });
};

export default methods;
