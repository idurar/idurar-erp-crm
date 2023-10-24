const mongoose = require('mongoose');

const Model = mongoose.model('Setting');

const updateBySettingKey = async ({ settingKey, settingValue }) => {
  try {
    console.log(
      '🚀 ~ file: updateBySettingKey.js:8 ~ updateBySettingKey ~ settingKey:',
      settingKey
    );
    if (!settingKey || !settingValue) {
      return null;
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
    // If no results found, return document not found
    if (!result) {
      return null;
    } else {
      // Return success resposne
      return result;
    }
  } catch {
    return null;
  }
};

module.exports = updateBySettingKey;
