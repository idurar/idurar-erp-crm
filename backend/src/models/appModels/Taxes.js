const mongoose = require('mongoose');

const taxesSchema = new mongoose.Schema(
  {
    taxName: { type: String, required: true },
    taxValue: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
    enabled: { type: Boolean, default: true },
    removed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Taxes', taxesSchema);