const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },

  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin', autopopulate: true, required: true },
  number: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  client: {
    type: mongoose.Schema.ObjectId,
    ref: 'Client',
    autopopulate: true,
    required: true,
  },
  invoice: {
    type: mongoose.Schema.ObjectId,
    ref: 'Invoice',
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
  depositPercentage: {
    type: Number,
    min: 0,
    max: 100,
  },
  currency: {
    type: String,
    default: 'NA',
    uppercase: true,
    required: true,
  },
  ref: {
    type: String,
  },
  description: {
    type: String,
  },
  reversal: {
    reversedAt: Date,
    reason: { type: String, trim: true },
    reversedBy: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
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
paymentSchema.plugin(require('mongoose-autopopulate'));
paymentSchema.index(
  { number: 1, year: 1 },
  {
    unique: true,
    partialFilterExpression: { removed: false, year: { $type: 'number' } },
  }
);
module.exports = mongoose.model('Payment', paymentSchema);
