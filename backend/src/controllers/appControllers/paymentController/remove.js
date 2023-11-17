const mongoose = require('mongoose');

const Model = mongoose.model('Payment');
const Invoice = mongoose.model('Invoice');

const remove = async (req, res) => {
  try {
    // Find document by id and updates with the required fields
    const previousPayment = await Model.findOne({
      _id: req.params.id,
      removed: false,
    });

    if (!previousPayment) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found by this id: ' + req.params.id,
      });
    }

    const { _id: paymentId, amount: previousAmount } = previousPayment;
    const { id: invoiceId, total, discount, credit: previousCredit } = previousPayment.invoice;

    // Find the document by id and delete it
    let updates = {
      removed: true,
    };
    // Find the document by id and delete it
    const result = await Model.findOneAndUpdate(
      { _id: req.params.id, removed: false },
      { $set: updates },
      {
        new: true, // return the new result instead of the old one
      }
    ).exec();
    // If no results found, return document not found

    let paymentStatus =
      total - discount === previousCredit - previousAmount
        ? 'paid'
        : previousCredit - previousAmount > 0
        ? 'partially'
        : 'unpaid';

    const updateInvoice = await Invoice.findOneAndUpdate(
      { _id: invoiceId },
      {
        $pull: {
          payment: paymentId,
        },
        $inc: { credit: -previousAmount },
        $set: {
          paymentStatus: paymentStatus,
        },
      },
      {
        new: true, // return the new result instead of the old one
      }
    ).exec();

    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully Deleted the document by id: ' + req.params.id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
      error: error,
    });
  }
};
module.exports = remove;
