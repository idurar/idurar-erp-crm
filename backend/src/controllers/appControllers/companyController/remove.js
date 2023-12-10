const mongoose = require('mongoose');

const Client = mongoose.model('Client');
const People = mongoose.model('People');

const remove = async (Model, req, res) => {
  return res.status(200).json({
    success: false,
    result: null,
    upgrade: true,
    message: 'please upgrade to use all app features',
  });
};
module.exports = remove;
