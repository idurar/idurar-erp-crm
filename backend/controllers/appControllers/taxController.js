const mongoose = require('mongoose');
const Model = mongoose.model('Tax');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const methods = createCRUDController('Tax');

delete methods['delete'];

methods.create = async (req, res) => {
  try {
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
  } catch (error) {
    // If error is thrown by Mongoose due to required validations
    if (error.name == 'ValidationError') {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Required fields are not supplied',
      });
    } else {
      // Server Error
      return res.status(500).json({
        success: false,
        result: null,
        message: error.message,
      });
    }
  }
};

methods.update = async (req, res) => {
  try {
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
  } catch (error) {
    // If error is thrown by Mongoose due to required validations
    if (error.name == 'ValidationError') {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Required fields are not supplied',
      });
    } else {
      // Server Error
      return res.status(500).json({
        success: false,
        result: null,
        message: error.message,
      });
    }
  }
};

module.exports = methods;
