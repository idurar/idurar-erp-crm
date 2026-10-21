const mongoose = require('mongoose');

const money = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;
const generateNumber = () =>
  `AB-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${new mongoose.Types.ObjectId().toString().slice(-6).toUpperCase()}`;

const itemSchema = new mongoose.Schema({
  article: { type: mongoose.Schema.ObjectId, ref: 'Article' },
  itemName: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  unit: { type: String, default: 'Stk.', trim: true },
  quantity: { type: Number, required: true, min: 0.001 },
  price: { type: Number, required: true, min: 0 },
  discount: { type: Number, min: 0, max: 100, default: 0 },
  total: { type: Number, min: 0, default: 0 },
});

const paymentStageSchema = new mongoose.Schema({
  label: { type: String, required: true, trim: true },
  percentage: { type: Number, required: true, min: 0.01, max: 100 },
  amount: { type: Number, min: 0, default: 0 },
  dueTrigger: {
    type: String,
    enum: ['confirmation', 'work_start', 'progress', 'completion', 'fixed_date'],
    default: 'confirmation',
  },
  dueDate: Date,
  notes: { type: String, trim: true },
});

const schema = new mongoose.Schema({
  removed: { type: Boolean, default: false },
  number: { type: String, required: true, trim: true, uppercase: true, default: generateNumber },
  date: { type: Date, required: true, default: Date.now },
  client: { type: mongoose.Schema.ObjectId, ref: 'Client', required: true, autopopulate: true },
  sourceQuote: { type: mongoose.Schema.ObjectId, ref: 'Quote', autopopulate: true },
  status: {
    type: String,
    enum: ['draft', 'confirmed', 'partially_invoiced', 'completed', 'cancelled'],
    default: 'draft',
  },
  items: {
    type: [itemSchema],
    validate: [(items) => items.length > 0, 'Mindestens eine Position ist erforderlich.'],
  },
  taxRate: { type: Number, min: 0, max: 100, default: 0 },
  subTotal: { type: Number, min: 0, default: 0 },
  taxTotal: { type: Number, min: 0, default: 0 },
  total: { type: Number, min: 0, default: 0 },
  currency: { type: String, required: true, uppercase: true, default: 'EUR' },
  paymentSchedule: {
    type: [paymentStageSchema],
    validate: [
      (stages) => {
        if (!stages?.length) return true;
        const total = stages.reduce((sum, stage) => sum + Number(stage.percentage || 0), 0);
        return Math.abs(total - 100) < 0.001;
      },
      'Der Zahlungsplan muss insgesamt genau 100 % ergeben.',
    ],
  },
  notes: { type: String, trim: true },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin', required: true },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

schema.pre('validate', function calculateTotals(next) {
  if (!this.number?.trim()) this.number = generateNumber();
  let subTotal = 0;
  for (const item of this.items || []) {
    item.total = money(
      Number(item.quantity) * Number(item.price) * (1 - Number(item.discount || 0) / 100)
    );
    subTotal = money(subTotal + item.total);
  }
  this.subTotal = subTotal;
  this.taxTotal = money(subTotal * Number(this.taxRate || 0) / 100);
  this.total = money(this.subTotal + this.taxTotal);
  for (const stage of this.paymentSchedule || []) {
    stage.amount = money(this.total * Number(stage.percentage || 0) / 100);
  }
  this.updated = new Date();
  next();
});

schema.index({ number: 1 }, { unique: true, partialFilterExpression: { removed: false } });
schema.index(
  { sourceQuote: 1 },
  { unique: true, partialFilterExpression: { removed: false, sourceQuote: { $type: 'objectId' } } }
);
schema.index({ client: 1, date: -1 });
schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('OrderConfirmation', schema);
