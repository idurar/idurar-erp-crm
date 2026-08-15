const mongoose = require('mongoose');
const Model = mongoose.model('Client');
const schema = require('./schemaValidate');

const create = async (req, res) => {
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

  // 2. Add metadata
  value.createdBy = req.admin._id;

  // 3. Save to database
  const result = await new Model(value).save();

  // 4. Return success response
  return res.status(200).json({
    success: true,
    result,
    message: 'Client created successfully',
  });
};

module.exports = create;
