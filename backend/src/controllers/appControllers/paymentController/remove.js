const mongoose = require('mongoose');

const Model = mongoose.model('Payment');
const Invoice = mongoose.model('Invoice');
const { deriveInvoiceStatus, derivePaymentStatus } = require('@/helpers/invoice');
const { calculate } = require('@/helpers');

const remove = async (req, res) => {
  // Find document by id and updates with the required fields
  const previousPayment = await Model.findOne({
    _id: req.params.id,
    removed: false,
  });

  if (!previousPayment) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No document found ',
    });
  }

  const reason = String(req.body?.reason || '').trim();
  if (reason.length < 3) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Bitte einen Stornogrund mit mindestens 3 Zeichen angeben.',
    });
  }

  const { _id: paymentId, amount: previousAmount } = previousPayment;
  const {
    id: invoiceId,
    total,
    discount,
    credit: previousCredit,
    dunningFees = 0,
  } = previousPayment.invoice;

  // Payments are never physically deleted. The reversal metadata keeps the audit trail intact.
  const result = await Model.findOneAndUpdate(
    {
      _id: req.params.id,
      removed: false,
      amount: previousAmount,
      updated: previousPayment.updated,
    },
    {
      $set: {
        removed: true,
        reversal: { reversedAt: new Date(), reason, reversedBy: req.admin._id },
        updated: new Date(),
      },
    },
    {
      new: true, // return the new result instead of the old one
    }
  ).exec();
  if (!result) {
    return res.status(409).json({
      success: false,
      result: null,
      message: 'Die Zahlung wurde zwischenzeitlich geändert. Bitte neu laden.',
    });
  }

  const paymentStatus = derivePaymentStatus({
    total,
    discount,
    dunningFees,
    credit: calculate.sub(previousCredit, previousAmount),
  });
  const invoiceStatus = deriveInvoiceStatus({
    ...previousPayment.invoice.toObject(),
    paymentStatus,
  });

  const updateInvoice = await Invoice.findOneAndUpdate(
    { _id: invoiceId, removed: false, payment: paymentId, credit: previousCredit },
    {
      $pull: {
        payment: paymentId,
      },
      $inc: { credit: -previousAmount },
      $set: {
        paymentStatus: paymentStatus,
        status: invoiceStatus,
        isOverdue: invoiceStatus === 'overdue',
        ...(paymentStatus === 'paid' && { nextReminderDate: null }),
      },
    },
    {
      new: true, // return the new result instead of the old one
    }
  ).exec();

  if (!updateInvoice) {
    await Model.updateOne(
      { _id: paymentId, 'reversal.reversedAt': result.reversal.reversedAt },
      { $set: { removed: false }, $unset: { reversal: 1 } }
    );
    return res.status(409).json({
      success: false,
      result: null,
      message:
        'Die Zahlung konnte wegen eines zwischenzeitlich geänderten Rechnungsstands nicht storniert werden.',
    });
  }

  return res.status(200).json({
    success: true,
    result,
    message: 'Zahlung wurde revisionssicher storniert.',
  });
};
module.exports = remove;
