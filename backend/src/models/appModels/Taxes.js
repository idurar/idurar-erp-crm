const mongoose = require('mongoose');

const taxesSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  taxName: {
    type: String,
    required: true,
  },
  taxValue: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Taxes', taxesSchema);
