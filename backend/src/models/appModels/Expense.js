const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: { type: Boolean, default: false },
  enabled: { type: Boolean, default: true },
  number: { type: String, required: true, trim: true, uppercase: true },
  date: { type: Date, required: true, default: Date.now },
  supplier: { type: mongoose.Schema.ObjectId, ref: 'Supplier', autopopulate: true },
  project: { type: mongoose.Schema.ObjectId, ref: 'Project', autopopulate: true },
  category: { type: mongoose.Schema.ObjectId, ref: 'ExpenseCategory', required: true, autopopulate: true },
  description: { type: String, required: true, trim: true },
  netAmount: { type: Number, required: true, min: 0 },
  taxRate: { type: Number, min: 0, max: 100, default: 20 },
  taxAmount: { type: Number, min: 0, default: 0 },
  grossAmount: { type: Number, min: 0, default: 0 },
  currency: { type: String, uppercase: true, default: 'EUR' },
  paid: { type: Boolean, default: false },
  paidAt: Date,
  reference: { type: String, trim: true },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin', required: true },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

schema.pre('validate', function calculateTotals(next) {
  this.taxAmount = Math.round((this.netAmount * this.taxRate + Number.EPSILON) * 100) / 10000;
  this.grossAmount = Math.round((this.netAmount + this.taxAmount + Number.EPSILON) * 100) / 100;
  this.updated = new Date();
  next();
});
schema.index({ number: 1 }, { unique: true, partialFilterExpression: { removed: false } });
schema.index({ date: -1, category: 1 });
schema.index({ project: 1, date: -1 });
schema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Expense', schema);
