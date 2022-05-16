const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const paymentModeSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ref: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('PaymentMode', paymentModeSchema);
