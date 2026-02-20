const mongoose = require('mongoose');

const Model = mongoose.model('Payment');
const Invoice = mongoose.model('Invoice');
const custom = require('@/controllers/pdfController');

const { calculate } = require('@/helpers');

const create = async (req, res) => {
  // Creating a new document in the collection
  if (req.body.amount === 0) {
    return res.status(202).json({
      success: false,
      result: null,
      message: `The Minimum Amount couldn't be 0`,
    });
  }

  // Atomically check remaining balance and reserve credit in one operation.
  // This prevents concurrent requests from each reading the same balance
  // and all passing the check independently.
  const invoiceUpdate = await Invoice.findOneAndUpdate(
    {
      _id: req.body.invoice,
      removed: false,
      $expr: {
        $gte: [
          { $subtract: [{ $subtract: ['$total', '$discount'] }, '$credit'] },
          req.body.amount,
        ],
      },
    },
    {
      $inc: { credit: req.body.amount },
    },
    { new: true }
  );

  if (!invoiceUpdate) {
    const invoice = await Invoice.findOne({
      _id: req.body.invoice,
      removed: false,
    });
    if (!invoice) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Invoice not found',
      });
    }
    const maxAmount = calculate.sub(
      calculate.sub(invoice.total, invoice.discount),
      invoice.credit
    );
    return res.status(202).json({
      success: false,
      result: null,
      message: `The Max Amount you can add is ${maxAmount}`,
    });
  }

  req.body['createdBy'] = req.admin._id;

  const result = await Model.create(req.body);

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

  const { _id: paymentId, amount } = result;
  const { total, discount, credit } = invoiceUpdate;

  let paymentStatus =
    calculate.sub(total, discount) === credit
      ? 'paid'
      : credit > 0
      ? 'partially'
      : 'unpaid';

  await Invoice.findOneAndUpdate(
    { _id: req.body.invoice },
    {
      $push: { payment: paymentId.toString() },
      $set: { paymentStatus: paymentStatus },
    },
    {
      new: true,
      runValidators: true,
    }
  ).exec();

  return res.status(200).json({
    success: true,
    result: updatePath,
    message: 'Payment Invoice created successfully',
  });
};

module.exports = create;
