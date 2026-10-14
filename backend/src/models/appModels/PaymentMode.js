const mongoose = require('mongoose');

const paymentModeSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  supportsDeposit: {
    type: Boolean,
    default: false,
  },
  defaultDepositPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('PaymentMode', paymentModeSchema);
