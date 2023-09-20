const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const supplierOrderSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  number: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  dateExpired: {
    type: Date,
    required: true,
  },
  supplier: {
    type: mongoose.Schema.ObjectId,
    ref: 'Supplier',
    required: true,
  },
  items: [
    {
      name: {
        type: String,
        trim: true,
        required: true,
      },
      description: {
        type: String,
        trim: true,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
    },
  ],
  taxRate: {
    type: Number,
  },
  subTotal: {
    type: Number,
  },
  taxTotal: {
    type: Number,
  },
  total: {
    type: Number,
  },
  credit: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  expense: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Expense',
    },
  ],
  paymentStatus: {
    type: String,
    trim: true,
    default: 'unpaid',
  },
  status: {
    type: String,
    default: 'draft',
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

module.exports = mongoose.model('SupplierOrder', supplierOrderSchema);
