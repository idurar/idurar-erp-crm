const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  branch: { type: mongoose.Schema.ObjectId, ref: 'Branch' },
  product: { type: mongoose.Schema.ObjectId, ref: 'Product', required: true },
  quantity: {
    type: Number,
    default: 0,
  },
  threshold: {
    type: Number,
    default: 0,
  },
  order: {
    type: Number,
    default: 0,
  },
  purchase: {
    type: Number,
    default: 0,
  },
  adjustment: {
    increase: {
      returned: {
        type: Number,
        default: 0,
      },
      change: {
        type: Number,
        default: 0,
      },
      refund: {
        type: Number,
        default: 0,
      },
      other: {
        type: Number,
        default: 0,
      },
    },
    decrease: {
      damaged: {
        type: Number,
        default: 0,
      },
      change: {
        type: Number,
        default: 0,
      },
      refund: {
        type: Number,
        default: 0,
      },
      other: {
        type: Number,
        default: 0,
      },
    },
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

module.exports = mongoose.model('Inventory', inventorySchema);
