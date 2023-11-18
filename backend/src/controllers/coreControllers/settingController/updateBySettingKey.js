const mongoose = require('mongoose');

const Model = mongoose.model('Setting');

const updateBySettingKey = async (req, res) => {
  try {
    const settingKey = req.params.settingKey || undefined;

    if (!settingKey) {
      return res.status(202).json({
        success: false,
        result: null,
        message: 'No settingKey provided ',
      });
    }
    const { settingValue } = req.body;

    if (!settingValue) {
      return res.status(202).json({
        success: false,
        result: null,
        message: 'No settingValue provided ',
      });
    }
    const result = await Model.findOneAndUpdate(
      { settingKey },
      {
        settingValue,
      },
      {
        new: true, // return the new result instead of the old one
        runValidators: true,
      }
    ).exec();
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
        message: 'we update this document by this id: ' + req.params.id,
      });
    }
  } catch (error) {
    // If error is thrown by Mongoose due to required validations
    if (error.name == 'ValidationError') {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Required fields are not supplied',
        error: error,
      });
    } else {
      // Server Error
      return res.status(500).json({
        success: false,
        result: null,
        message: error.message,
        error: error,
      });
    }
  }
};

module.exports = updateBySettingKey;
