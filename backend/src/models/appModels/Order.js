const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'Admin',
  },
  branch: { type: mongoose.Schema.ObjectId, ref: 'Branch' },
  assigned: {
    type: mongoose.Schema.ObjectId,
    ref: 'Employee',
  },
  number: {
    type: Number,
    unique: true,
    required: true,
  },
  recurring: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'annually', 'quarter'],
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  client: {
    type: mongoose.Schema.ObjectId,
    ref: 'Client',
    required: true,
    autopopulate: true,
  },
  invoice: {
    type: mongoose.Schema.ObjectId,
    ref: 'Ivoince',
    autopopulate: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true,
      },
      itemName: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
      quantity: {
        type: Number,
        default: 1,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      discount: {
        type: Number,
        default: 0,
      },
      // taxRate: {
      //   type: Number,
      //   default: 0,
      // },
      // subTotal: {
      //   type: Number,
      //   default: 0,
      // },
      // taxTotal: {
      //   type: Number,
      //   default: 0,
      // },
      total: {
        type: Number,
      },
      note: {
        type: String,
      },
    },
  ],
  shipment: {
    type: mongoose.Schema.ObjectId,
    ref: 'Shipment',
  },
  approved: {
    type: Boolean,
    default: false,
  },
  note: {
    type: String,
  },
  fulfillment: {
    type: String,
    enum: ['pending', 'in review', 'processing', 'packing', 'shipped', 'on hold', 'cancelled'],
    default: 'pending',
  },
  status: {
    type: String,
    enum: [
      'not started',
      'in progress',
      'delayed',
      'completed',
      'delivered',
      'returned',
      'cancelled',
      'on hold',
      'refunded',
    ],
    default: 'not started',
  },
  processingStatus: String,
  pdf: {
    type: String,
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

orderSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Order', orderSchema);
