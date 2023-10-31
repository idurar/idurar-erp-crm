const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const offerSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin', required: true },
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
  lead: {
    type: mongoose.Schema.ObjectId,
    ref: 'Lead',
    required: true,
    autopopulate: true,
  },
  items: [
    {
      itemName: {
        type: String,
        required: true,
      },
      description: {
        type: String,
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
  subOfferTotal: {
    type: Number,
  },
  taxTotal: {
    type: Number,
  },
  total: {
    type: Number,
  },
  discount: {
    type: Number,
    default: 0,
  },
  note: {
    type: String,
  },
  status: {
    type: String,
    default: 'Draft',
  },
  pdfPath: {
    type: String,
    default: '',
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

offerSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Offer', offerSchema);
