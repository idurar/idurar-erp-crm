const mongoose = require('mongoose');
const People = mongoose.model('People');
const Company = mongoose.model('Company');

const update = async (Model, req, res) => {
  return res.status(200).json({
    success: true,
    result: null,
    message: 'Please Upgrade to Premium  Version to have full features',
  });
};

module.exports = update;
