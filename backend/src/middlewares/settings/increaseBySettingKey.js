const mongoose = require('mongoose');

const Model = mongoose.model('Setting');

const increaseBySettingKey = async ({ settingKey, session = null }) => {
  try {
    if (!settingKey) {
      return null;
    }

    const result = await Model.findOneAndUpdate(
      { settingKey, removed: false, enabled: true },
      {
        $inc: { settingValue: 1 },
      },
      {
        new: true, // return the new result instead of the old one
        runValidators: true,
        session,
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

module.exports = increaseBySettingKey;
