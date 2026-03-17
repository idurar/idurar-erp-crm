const mongoose = require('mongoose');
const Model = mongoose.model('Client');
const schema = require('./schemaValidate');

const update = async (req, res) => {
  let body = req.body;

  // 1. Validate the body using Joi
  const { error, value } = schema.validate(body);
  if (error) {
    return res.status(400).json({
      success: false,
      result: null,
      message: error.details[0].message,
    });
  }

  // 2. Find and update
  const result = await Model.findOneAndUpdate({ _id: req.params.id, removed: false }, value, {
    new: true, // return the new modified document
    runValidators: true,
  }).exec();

  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No document found by this id: ' + req.params.id,
    });
  } else {
    return res.status(200).json({
      success: true,
      result,
      message: 'Client updated successfully',
    });
  }
};

module.exports = update;
