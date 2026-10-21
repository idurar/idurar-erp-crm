const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },

  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin', required: true },
  documentType: { type: String, enum: ['invoice', 'credit_note'], default: 'invoice' },
  originalInvoice: { type: mongoose.Schema.ObjectId, ref: 'Invoice' },
  creditReason: { type: String, trim: true },
  number: {
    type: Number,
  },
  year: {
    type: Number,
    required: true,
  },
  content: String,
  recurring: {
    type: String,
    enum: ['none', 'weekly', 'monthly', 'quarterly', 'annually'],
    default: 'none',
  },
  recurringActive: { type: Boolean, default: false },
  nextRecurringDate: Date,
  recurringAnchorDate: Date,
  recurringEndDate: Date,
  recurringSource: { type: mongoose.Schema.ObjectId, ref: 'Invoice' },
  recurringOccurrenceDate: Date,
  recurringProcessingAt: Date,
  recurringFailedAt: Date,
  recurringLastError: { type: String, maxlength: 500 },
  issuingAt: Date,
  date: {
    type: Date,
    required: true,
  },
  serviceDate: {
    type: Date,
    required: true,
  },
  expiredDate: {
    type: Date,
    required: true,
  },
  client: {
    type: mongoose.Schema.ObjectId,
    ref: 'Client',
    required: true,
    autopopulate: true,
  },
  converted: {
    from: {
      type: String,
      enum: ['quote', 'offer'],
    },
    offer: {
      type: mongoose.Schema.ObjectId,
      ref: 'Offer',
    },
    quote: {
      type: mongoose.Schema.ObjectId,
      ref: 'Quote',
    },
  },
  items: [
    {
      article: { type: mongoose.Schema.ObjectId, ref: 'Article' },
      // product: {
      //   type: mongoose.Schema.ObjectId,
      //   ref: 'Product',
      //   // required: true,
      // },
      itemName: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
      unit: { type: String, default: 'Stk.' },
      discount: { type: Number, min: 0, max: 100, default: 0 },
      quantity: {
        type: Number,
        default: 1,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      // discount: {
      //   type: Number,
      //   default: 0,
      // },
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
        required: true,
      },
    },
  ],
  taxRate: {
    type: Number,
    default: 0,
  },
  subTotal: {
    type: Number,
    default: 0,
  },
  taxTotal: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    default: 0,
  },
  currency: {
    type: String,
    default: 'NA',
    uppercase: true,
    required: true,
  },
  credit: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  payment: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Payment',
    },
  ],
  paymentStatus: {
    type: String,
    default: 'unpaid',
    enum: ['unpaid', 'paid', 'partially'],
  },
  isOverdue: {
    type: Boolean,
    default: false,
  },
  reminderLevel: {
    type: Number,
    min: 0,
    max: 3,
    default: 0,
  },
  nextReminderDate: Date,
  dunningFees: { type: Number, min: 0, default: 0 },
  reminderHistory: [
    {
      level: { type: Number, min: 1, max: 3, required: true },
      sentAt: { type: Date, default: Date.now },
      dueDate: Date,
      fee: { type: Number, min: 0, default: 0 },
      note: String,
    },
  ],
  cancellation: {
    cancelledAt: Date,
    reason: { type: String, trim: true },
    cancelledBy: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
  },
  sentAt: Date,
  issuedAt: Date,
  inventoryBookedAt: Date,
  inventoryReversedAt: Date,
  approved: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
  },
  clientVatNumber: { type: String, trim: true, uppercase: true },
  paymentTermsText: { type: String },
  footerText: { type: String },
  status: {
    type: String,
    enum: [
      'draft',
      'pending',
      'issued',
      'sent',
      'overdue',
      'paid',
      'refunded',
      'cancelled',
      'on hold',
    ],
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

invoiceSchema.plugin(require('mongoose-autopopulate'));
invoiceSchema.index(
  { number: 1, year: 1 },
  {
    unique: true,
    partialFilterExpression: { removed: false, number: { $type: 'number' } },
  }
);
invoiceSchema.index(
  { originalInvoice: 1, documentType: 1 },
  {
    unique: true,
    partialFilterExpression: { removed: false, documentType: 'credit_note' },
  }
);
invoiceSchema.index(
  { 'converted.quote': 1 },
  {
    unique: true,
    partialFilterExpression: { removed: false, 'converted.from': 'quote' },
  }
);
invoiceSchema.index(
  { recurringSource: 1, recurringOccurrenceDate: 1 },
  {
    unique: true,
    partialFilterExpression: { removed: false, recurringSource: { $exists: true } },
  }
);
invoiceSchema.index({ recurringActive: 1, nextRecurringDate: 1 });
module.exports = mongoose.model('Invoice', invoiceSchema);
