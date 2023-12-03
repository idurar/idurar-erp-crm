const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  branch: { type: mongoose.Schema.ObjectId, ref: 'Branch' },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin', required: true },
  number: {
    type: Number,
    required: true,
  },
  recurring: {
    type: String,
    enum: ['weekly', 'monthly', 'annually', 'quarter'],
  },
  date: {
    type: Date,
    required: true,
  },
  employee: {
    type: mongoose.Schema.ObjectId,
    ref: 'Employee',
    required: true,
    autopopulate: true,
  },
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  basicSalary: {
    type: Number,
    required: true,
  },
  deduction: {
    type: Number,
    default: 0,
  },
  allowance: {
    type: Number,
    default: 0,
  },
  overtime: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    default: 0,
  },
  payment: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'SalaryPayment',
    },
  ],
  paymentStatus: {
    type: String,
    default: 'unpaid',
    enum: ['unpaid', 'paid', 'partially'],
  },
  approved: {
    type: Boolean,
    default: false,
  },
  note: {
    type: String,
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'completed', 'processing', 'on hold'],
    default: 'draft',
  },
  pdf: {
    type: String,
  },
  files: [
    {
      id: String,
      name: String,
      path: String,
      description: String,
      isPublic: {
        type: Boolean,
        default: true,
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

salarySchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Salary', salarySchema);
