const mongoose = require('mongoose');

const Model = mongoose.model('Payment');
const Invoice = mongoose.model('Invoice');
const { calculate } = require('@/helpers');
const { deriveInvoiceStatus, derivePaymentStatus } = require('@/helpers/invoice');

const update = async (req, res) => {
  const requestedAmount = Number(req.body.amount);
  if (!Number.isFinite(requestedAmount) || requestedAmount <= 0) {
    return res.status(400).json({
      success: false,
      result: null,
      message: `The Minimum Amount couldn't be 0`,
    });
  }
  const requestedDate = req.body.date ? new Date(req.body.date) : null;
  if (requestedDate && Number.isNaN(requestedDate.getTime())) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Ungültiges Zahlungsdatum.',
    });
  }
  // Find document by id and updates with the required fields
  const previousPayment = await Model.findOne({
    _id: req.params.id,
    removed: false,
  });

  if (!previousPayment) {
    return res
      .status(404)
      .json({ success: false, result: null, message: 'Zahlung nicht gefunden' });
  }
  if (['cancelled', 'refunded'].includes(previousPayment.invoice.status)) {
    return res
      .status(409)
      .json({
        success: false,
        result: null,
        message: 'Zahlungen stornierter Rechnungen können nicht geändert werden.',
      });
  }

  const { amount: previousAmount } = previousPayment;
  const {
    id: invoiceId,
    total,
    discount,
    credit: previousCredit,
    dunningFees = 0,
  } = previousPayment.invoice;

  const currentAmount = requestedAmount;

  const changedAmount = calculate.sub(currentAmount, previousAmount);
  const maxAmount = calculate.sub(
    calculate.add(total, dunningFees),
    calculate.add(discount, previousCredit)
  );

  if (changedAmount > maxAmount) {
    return res.status(409).json({
      success: false,
      result: null,
      message: `The Max Amount you can add is ${maxAmount + previousAmount}`,
      error: `The Max Amount you can add is ${maxAmount + previousAmount}`,
    });
  }

  const paymentStatus = derivePaymentStatus({
    total,
    discount,
    dunningFees,
    credit: calculate.add(previousCredit, changedAmount),
  });

  const updatedDate = new Date();
  const updates = {
    date: requestedDate || previousPayment.date,
    amount: req.body.amount,
    paymentMode: req.body.paymentMode,
    ref: req.body.ref,
    description: req.body.description,
    updated: updatedDate,
  };

  const invoiceSnapshot = previousPayment.invoice.toObject();
  const invoiceStatus = deriveInvoiceStatus({ ...invoiceSnapshot, paymentStatus });
  const updateInvoice = await Invoice.findOneAndUpdate(
    {
      _id: invoiceId,
      removed: false,
      status: { $nin: ['cancelled', 'refunded'] },
      credit: previousCredit,
      $expr: {
        $and: [
          { $gte: [{ $add: ['$credit', changedAmount] }, 0] },
          {
            $lte: [
              { $add: ['$credit', changedAmount] },
              {
                $subtract: [{ $add: ['$total', { $ifNull: ['$dunningFees', 0] }] }, '$discount'],
              },
            ],
          },
        ],
      },
    },
    {
      $inc: { credit: changedAmount },
      $set: {
        paymentStatus,
        status: invoiceStatus,
        isOverdue: invoiceStatus === 'overdue',
        ...(paymentStatus === 'paid' && { nextReminderDate: null }),
      },
    },
    { new: true, runValidators: true }
  ).exec();

  if (!updateInvoice) {
    return res.status(409).json({
      success: false,
      result: null,
      message: 'Der Rechnungsstand wurde zwischenzeitlich geändert. Bitte neu laden.',
    });
  }

  const result = await Model.findOneAndUpdate(
    {
      _id: req.params.id,
      removed: false,
      amount: previousAmount,
      updated: previousPayment.updated,
    },
    { $set: updates },
    {
      new: true, // return the new result instead of the old one
    }
  ).exec();

  if (!result) {
    await Invoice.updateOne(
      { _id: invoiceId, credit: updateInvoice.credit },
      {
        $inc: { credit: -changedAmount },
        $set: {
          paymentStatus: invoiceSnapshot.paymentStatus,
          status: invoiceSnapshot.status,
          isOverdue: invoiceSnapshot.isOverdue,
          nextReminderDate: invoiceSnapshot.nextReminderDate,
        },
      }
    );
    return res.status(409).json({
      success: false,
      result: null,
      message: 'Die Zahlung wurde zwischenzeitlich geändert. Bitte neu laden.',
    });
  }

  return res.status(200).json({
    success: true,
    result,
    message: 'Successfully updated the Payment ',
  });
};

module.exports = update;
