const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  type: {
    type: String,
    default: 'company',
    enum: ['company', 'people'],
  },
  company: { type: mongoose.Schema.ObjectId, ref: 'Company' },
  people: { type: mongoose.Schema.ObjectId, ref: 'People' },
  interestedIn: [{ type: mongoose.Schema.ObjectId, ref: 'Product' }],
  offer: [{ type: mongoose.Schema.ObjectId, ref: 'Offer' }],
  converted: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
  owner: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
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
  discount: {
    type: Number,
    default: 0,
  },
  images: [
    {
      id: String,
      name: String,
      path: String,
      description: String,
      isPublic: {
        type: Boolean,
        default: fale,
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
        default: fale,
      },
    },
  ],
  category: String,
  status: String,
  notes: String,
  source: String,
  approved: {
    type: Boolean,
    default: false,
  },
  tags: [
    {
      type: String,
      trim: true,
      lowercase: true,
    },
  ],
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Lead', leadSchema);
