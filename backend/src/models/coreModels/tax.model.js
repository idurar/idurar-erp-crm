const mongoose = require('mongoose');

const taxSchema = new mongoose.Schema(
  {
    taxName: {
      type: String,
      required: true,
      trim: true,
    },
    taxValue: {
      type: Number,
      required: true,
      min: 0,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Tax', taxSchema);