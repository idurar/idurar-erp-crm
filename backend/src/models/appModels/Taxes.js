const mongoose = require('mongoose');

const taxesSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  taxName: {
    type: String,
    required: true,
    trim: true,
  },
  taxValue: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
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

module.exports = mongoose.model('Taxes', taxesSchema);
