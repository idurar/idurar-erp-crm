import mongoose from 'mongoose';

const Model = mongoose.model('Setting');

const increaseBySettingKey = async ({ settingKey }) => {
  try {
    if (!settingKey) {
      return null;
    }

    const result = await Model.findOneAndUpdate(
      { settingKey },
      {
        $inc: { settingValue: 1 },
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
      // Return success response
      return result;
    }
  } catch {
    return null;
  }
};

export default increaseBySettingKey;
