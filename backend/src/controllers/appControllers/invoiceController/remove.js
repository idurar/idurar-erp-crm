const mongoose = require('mongoose');

const Model = mongoose.model('Invoice');
const ModelPayment = mongoose.model('Payment');

const remove = async (req, res) => {
  const invoice = await Model.findOne({ _id: req.params.id, removed: false });
  if (!invoice) {
    return res.status(404).json({ success: false, result: null, message: 'Invoice not found' });
  }
  if (invoice.status !== 'draft' || invoice.credit > 0) {
    return res.status(409).json({
      success: false,
      result: invoice,
      message: 'Nur unbezahlte Entwürfe dürfen gelöscht werden. Bitte die Rechnung stattdessen stornieren.',
    });
  }
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
  const paymentsInvoices = await ModelPayment.updateMany(
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
