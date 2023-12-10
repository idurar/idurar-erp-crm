const mongoose = require('mongoose');

const SalaryPaymentSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin', autopopulate: true, required: true },
  employee: {
    type: mongoose.Schema.ObjectId,
    ref: 'Employee',
    autopopulate: true,
    required: true,
  },
  salary: {
    type: mongoose.Schema.ObjectId,
    ref: 'Salary',
    required: true,
    autopopulate: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentMode: {
    type: mongoose.Schema.ObjectId,
    ref: 'PaymentMode',
    autopopulate: true,
  },
  ref: {
    type: String,
  },
  receipt: String,
  description: {
    type: String,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});
SalaryPaymentSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('SalaryPayment', SalaryPaymentSchema);
