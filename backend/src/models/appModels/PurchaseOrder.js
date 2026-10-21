const mongoose = require('mongoose');

const generateOrderNumber = () => `BE-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${new mongoose.Types.ObjectId().toString().slice(-6).toUpperCase()}`;

const itemSchema = new mongoose.Schema(
  {
    description: { type: String, required: true, trim: true },
    article: { type: mongoose.Schema.ObjectId, ref: 'Article', autopopulate: true },
    project: { type: mongoose.Schema.ObjectId, ref: 'Project', autopopulate: true },
    quantity: { type: Number, required: true, min: 0.001 },
    unit: { type: String, trim: true, default: 'Stk.' },
    unitPrice: { type: Number, min: 0, default: 0 },
    taxRate: { type: Number, min: 0, max: 100, default: 20 },
    netAmount: { type: Number, min: 0, default: 0 },
    taxAmount: { type: Number, min: 0, default: 0 },
    grossAmount: { type: Number, min: 0, default: 0 },
  }
);

const schema = new mongoose.Schema({
  removed: { type: Boolean, default: false },
  enabled: { type: Boolean, default: true },
  number: {
    type: String,
    trim: true,
    uppercase: true,
    default: generateOrderNumber,
  },
  supplier: { type: mongoose.Schema.ObjectId, ref: 'Supplier', required: true, autopopulate: true },
  project: { type: mongoose.Schema.ObjectId, ref: 'Project', autopopulate: true },
  commission: { type: String, trim: true },
  orderDate: { type: Date, required: true, default: Date.now },
  expectedDate: Date,
  status: {
    type: String,
    enum: ['draft', 'ordered', 'partially_received', 'received', 'cancelled'],
    default: 'ordered',
  },
  items: { type: [itemSchema], validate: [(items) => items.length > 0, 'Mindestens eine Position ist erforderlich.'] },
  netTotal: { type: Number, min: 0, default: 0 },
  taxTotal: { type: Number, min: 0, default: 0 },
  grossTotal: { type: Number, min: 0, default: 0 },
  currency: { type: String, uppercase: true, default: 'EUR' },
  reference: { type: String, trim: true },
  notes: { type: String, trim: true },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin', required: true, autopopulate: true },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

const money = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;
schema.pre('validate', function calculateTotals(next) {
  if (!this.number?.trim()) this.number = generateOrderNumber();
  let netTotal = 0;
  let taxTotal = 0;
  for (const item of this.items || []) {
    item.netAmount = money(Number(item.quantity) * Number(item.unitPrice || 0));
    item.taxAmount = money(item.netAmount * item.taxRate / 100);
    item.grossAmount = money(item.netAmount + item.taxAmount);
    netTotal += item.netAmount;
    taxTotal += item.taxAmount;
  }
  this.netTotal = money(netTotal);
  this.taxTotal = money(taxTotal);
  this.grossTotal = money(netTotal + taxTotal);
  this.updated = new Date();
  next();
});

schema.index({ number: 1 }, { unique: true, partialFilterExpression: { removed: false } });
schema.index({ supplier: 1, orderDate: -1 });
schema.index({ project: 1, orderDate: -1 });
schema.index({ commission: 1, orderDate: -1 });
schema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('PurchaseOrder', schema);
