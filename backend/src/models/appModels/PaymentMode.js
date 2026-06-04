const mongoose = require('mongoose');

const paymentModeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    isDefault: { type: Boolean, default: false },
    enabled: { type: Boolean, default: true },
    removed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PaymentMode', paymentModeSchema);