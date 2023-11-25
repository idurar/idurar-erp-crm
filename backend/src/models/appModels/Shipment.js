const mongoose = require('mongoose');

const ShipmentSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  branch: { type: mongoose.Schema.ObjectId, ref: 'Branch' },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'Admin',
    required: true,
  },
  assigned: {
    type: mongoose.Schema.ObjectId,
    ref: 'Employee',
  },
  order: {
    type: mongoose.Schema.ObjectId,
    ref: 'Order',
  },
  carrier: {
    type: String,
    required: true,
  },
  trackingNmber: String,
  trackingLink: String,
  date: {
    type: Date,
    required: true,
  },
  estimatedDeliveryDate: {
    type: Date,
  },
  client: {
    type: mongoose.Schema.ObjectId,
    ref: 'Client',
  },
  invoice: {
    type: mongoose.Schema.ObjectId,
    ref: 'Ivoince',
  },
  recipient: {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
      },
      quantity: {
        type: String,
        required: true,
      },
    },
  ],
  approved: {
    type: Boolean,
    default: false,
  },
  note: {
    type: String,
  },
  status: {
    type: String,
    enum: [
      'pending',
      'confirmed',
      'in transit',
      'out for delivery',
      'delivered',
      'returned',
      'failed',
      'cancelled',
    ],
    default: 'pending',
  },
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

ShipmentSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Shipment', ShipmentSchema);
