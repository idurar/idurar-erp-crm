const mongoose = require('mongoose');

const Model = mongoose.model('Setting');

const updateBySettingKey = async (req, res) => {
  try {
    const settingKey = req.params.settingKey || undefined;
    console.log(
      '🚀 ~ file: updateBySettingKey.js:8 ~ updateBySettingKey ~ settingKey:',
      settingKey
    );

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
  } catch (err) {
    // If err is thrown by Mongoose due to required validations
    if (err.name == 'ValidationError') {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Required fields are not supplied',
        error: err,
      });
    } else {
      // Server Error
      return res.status(500).json({
        success: false,
        result: null,
        message: 'Oops there is an Error',
        error: err,
      });
    }
  }
};

module.exports = updateBySettingKey;
