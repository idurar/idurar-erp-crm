const mongoose = require('mongoose');

const Model = mongoose.model('Setting');

const listAllSetting = async () => {
  const sort = parseInt(req.query.sort) || 'desc';
  try {
    //  Query the database for a list of all results
    const result = await Model.find({ removed: false }).sort({ created: sort }).populate();

    if (result.length > 0) {
      return result;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

module.exports = listAllSetting;
