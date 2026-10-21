const mongoose = require('mongoose');

const Model = mongoose.model('Payment');
const Invoice = mongoose.model('Invoice');
const { calculate } = require('@/helpers');
const { deriveInvoiceStatus, derivePaymentStatus } = require('@/helpers/invoice');
const { increaseBySettingKey } = require('@/middlewares/settings');

const create = async (req, res) => {
  // Creating a new document in the collection
  const amountValue = Number(req.body.amount);
  if (!Number.isFinite(amountValue) || amountValue <= 0) {
    return res.status(400).json({
      success: false,
      result: null,
      message: `The Minimum Amount couldn't be 0`,
    });
  }

  const currentInvoice = await Invoice.findOne({
    _id: req.body.invoice,
    removed: false,
  });

  if (!currentInvoice) {
    return res
      .status(404)
      .json({ success: false, result: null, message: 'Rechnung nicht gefunden' });
  }
  if (!currentInvoice.issuedAt) {
    return res.status(409).json({
      success: false,
      result: currentInvoice,
      message: 'Zahlungen können erst nach der Veröffentlichung erfasst werden.',
    });
  }
  if (['cancelled', 'refunded'].includes(currentInvoice.status)) {
    return res.status(409).json({
      success: false,
      result: currentInvoice,
      message: 'Für stornierte oder gutgeschriebene Rechnungen kann keine Zahlung erfasst werden.',
    });
  }

  const {
    total: previousTotal,
    discount: previousDiscount,
    credit: previousCredit,
    dunningFees = 0,
  } = currentInvoice;

  const maxAmount = calculate.sub(
    calculate.sub(calculate.add(previousTotal, dunningFees), previousDiscount),
    previousCredit
  );

  if (amountValue > maxAmount) {
    return res.status(409).json({
      success: false,
      result: null,
      message: `The Max Amount you can add is ${maxAmount}`,
    });
  }
  const paymentDate = req.body.date ? new Date(req.body.date) : new Date();
  if (Number.isNaN(paymentDate.getTime())) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Ungültiges Zahlungsdatum.',
    });
  }
  const numberSetting = await increaseBySettingKey({ settingKey: 'last_payment_number' });
  if (!numberSetting) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Zahlungsnummernkreis ist nicht konfiguriert.',
    });
  }
  const paymentData = {
    ...req.body,
    invoice: currentInvoice._id,
    client: currentInvoice.client?._id || currentInvoice.client,
    currency: currentInvoice.currency,
    number: Number(numberSetting.settingValue),
    year: paymentDate.getFullYear(),
    date: paymentDate,
    createdBy: req.admin._id,
    amount: amountValue,
  };

  const result = await Model.create(paymentData);

  const fileId = 'payment-' + result._id + '.pdf';
  const updatePath = await Model.findOneAndUpdate(
    {
      _id: result._id.toString(),
      removed: false,
    },
    { pdf: fileId },
    {
      new: true,
    }
  ).exec();
  // Returning successfull response

  const { _id: paymentId, amount } = result;
  const { id: invoiceId, total, discount, credit } = currentInvoice;

  const paymentStatus = derivePaymentStatus({
    total,
    discount,
    dunningFees,
    credit: calculate.add(credit, amount),
  });

  const invoiceUpdate = await Invoice.findOneAndUpdate(
    {
      _id: paymentData.invoice,
      removed: false,
      credit: previousCredit,
      status: { $nin: ['cancelled', 'refunded'] },
      $expr: {
        $lte: [
          { $add: ['$credit', amountValue] },
          { $subtract: [{ $add: ['$total', { $ifNull: ['$dunningFees', 0] }] }, '$discount'] },
        ],
      },
    },
    {
      $push: { payment: paymentId.toString() },
      $inc: { credit: amount },
      $set: {
        paymentStatus: paymentStatus,
        status: deriveInvoiceStatus({ ...currentInvoice.toObject(), paymentStatus }),
        ...(paymentStatus === 'paid' && { isOverdue: false, nextReminderDate: null }),
      },
    },
    {
      new: true, // return the new result instead of the old one
      runValidators: true,
    }
  ).exec();

  if (!invoiceUpdate) {
    await Model.deleteOne({ _id: result._id });
    return res.status(409).json({
      success: false,
      result: null,
      message: 'Der offene Betrag wurde zwischenzeitlich geändert. Bitte neu laden.',
    });
  }

  return res.status(200).json({
    success: true,
    result: updatePath,
    message: 'Payment Invoice created successfully',
  });
};

module.exports = create;
