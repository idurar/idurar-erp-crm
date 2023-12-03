const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  branch: { type: mongoose.Schema.ObjectId, ref: 'Branch' },
  product: { type: mongoose.Schema.ObjectId, ref: 'Product', required: true },
  hasOrder: {
    type: Boolean,
    default: false,
  },
  order: { type: mongoose.Schema.ObjectId, ref: 'Order', required: true },
  adjustmentType: { type: String, enum: ['increase', 'decrease'] },
  reasonType: {
    type: String,
    enum: ['returned', 'damaged', 'change', 'refund', 'other'],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('InventoryAdjustment', schema);
