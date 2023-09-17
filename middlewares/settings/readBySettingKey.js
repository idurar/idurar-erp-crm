const mongoose = require('mongoose');

const Model = mongoose.model('Setting');

const readBySettingKey = async ({ settingKey }) => {
  try {
    // Find document by id

    if (!settingKey) {
      return null;
    }

    const result = await Model.findOne({ settingKey });
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

module.exports = readBySettingKey;
