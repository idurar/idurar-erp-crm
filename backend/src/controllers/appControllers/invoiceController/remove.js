const mongoose = require('mongoose');

const Model = mongoose.model('Invoice');
const ModalPayment = mongoose.model('Payment');

const remove = async (req, res) => {
  const deletedInvoice = await Model.findOneAndUpdate(
    {
      _id: req.params.id,
      removed: false,
    },
    {
      $set: {
        removed: true,
      },
    }
  ).exec();

  if (!deletedInvoice) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'Invoice not found',
    });
  }
  const paymentsInvoices = await ModalPayment.updateMany(
    { invoice: deletedInvoice._id },
    { $set: { removed: true } }
  );
  return res.status(200).json({
    success: true,
    result: deletedInvoice,
    message: 'Invoice deleted successfully',
  });
};

module.exports = remove;
