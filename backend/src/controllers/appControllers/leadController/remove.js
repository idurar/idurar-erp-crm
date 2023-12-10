const mongoose = require('mongoose');

const Offer = mongoose.model('Offer');
// const InvoiceModel = mongoose.model('Invoice');
// const People = mongoose.model('People');
// const Company = mongoose.model('Company');

const remove = async (Model, req, res) => {
  return res.status(200).json({
    success: false,
    result: null,
    upgrade: true,
    message: 'please upgrade to use all app features',
  });
};
module.exports = remove;
