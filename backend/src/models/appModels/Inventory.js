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
  product: { type: mongoose.Schema.ObjectId, ref: 'Product', required: true },
  quantity: {
    type: Number,
    default: 0,
  },
  threshold: {
    type: Number,
    default: 0,
  },
  purchases: [
    {
      purshase: { type: mongoose.Schema.ObjectId, ref: 'Purshase', required: true },
      quantity: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  Orders: [
    {
      order: { type: mongoose.Schema.ObjectId, ref: 'Order', required: true },
      quantity: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  adjustments: [
    {
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
    },
  ],
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Inventory', inventorySchema);
