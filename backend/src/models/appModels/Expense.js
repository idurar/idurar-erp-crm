const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  branch: { type: mongoose.Schema.ObjectId, ref: 'Branch' },
  date: {
    type: Date,
    default: Date.now,
  },
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
  ref: {
    type: String,
    trim: true,
  },
  recurring: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'annually', 'quarter'],
  },
  supplier: {
    type: mongoose.Schema.ObjectId,
  },
  expenseCategory: {
    type: mongoose.Schema.ObjectId,
    ref: 'ExpenseCategory',
    required: true,
  },
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
  paymentMode: {
    type: mongoose.Schema.ObjectId,
    ref: 'PaymentMode',
  },
  receipt: String,
  images: [
    {
      id: String,
      name: String,
      path: String,
      description: String,
      isPublic: {
        type: Boolean,
        default: false,
      },
    },
  ],
  files: [
    {
      id: String,
      name: String,
      path: String,
      description: String,
      isPublic: {
        type: Boolean,
        default: false,
      },
    },
  ],
  updated: {
    type: Date,
    default: Date.now,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Expense', expenseSchema);
