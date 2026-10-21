const mongoose = require('mongoose');

const generateReceiptNumber = () => `WE-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${new mongoose.Types.ObjectId().toString().slice(-6).toUpperCase()}`;

const receiptItemSchema = new mongoose.Schema({
  purchaseOrderLineId: { type: String, required: true },
  article: { type: mongoose.Schema.ObjectId, ref: 'Article', required: true, autopopulate: true },
  project: { type: mongoose.Schema.ObjectId, ref: 'Project', autopopulate: true },
  commission: { type: String, trim: true },
  description: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, min: 0.001 },
  unit: { type: String, trim: true, default: 'Stk.' },
  unitPrice: { type: Number, min: 0, default: 0 },
});

const schema = new mongoose.Schema({
  removed: { type: Boolean, default: false },
  number: { type: String, required: true, trim: true, uppercase: true, default: generateReceiptNumber },
  purchaseOrder: { type: mongoose.Schema.ObjectId, ref: 'PurchaseOrder', required: true, autopopulate: true },
  supplier: { type: mongoose.Schema.ObjectId, ref: 'Supplier', required: true, autopopulate: true },
  project: { type: mongoose.Schema.ObjectId, ref: 'Project', autopopulate: true },
  commission: { type: String, trim: true },
  receivedAt: { type: Date, required: true, default: Date.now },
  deliveryNoteNumber: { type: String, trim: true },
  items: { type: [receiptItemSchema], validate: [(items) => items.length > 0, 'Mindestens eine Lieferposition ist erforderlich.'] },
  notes: { type: String, trim: true },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin', required: true },
  created: { type: Date, default: Date.now },
});

schema.pre('validate', function ensureNumber(next) {
  if (!this.number?.trim()) this.number = generateReceiptNumber();
  next();
});

schema.index({ number: 1 }, { unique: true, partialFilterExpression: { removed: false } });
schema.index({ purchaseOrder: 1, receivedAt: -1 });
schema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('GoodsReceipt', schema);
