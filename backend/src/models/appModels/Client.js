const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },

  name: {
    type: String,
    required: true,
    trim: true,
  },
  contactName: { type: String, trim: true },
  contacts: [
    {
      name: { type: String, trim: true },
      email: { type: String, trim: true, lowercase: true },
      phone: { type: String, trim: true },
      role: { type: String, trim: true },
      isPrimary: { type: Boolean, default: false },
    },
  ],
  phone: String,
  country: String,
  address: String,
  postalCode: { type: String, trim: true },
  city: { type: String, trim: true },
  billingAddress: {
    address: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    city: { type: String, trim: true },
    country: { type: String, trim: true },
  },
  shippingAddress: {
    address: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    city: { type: String, trim: true },
    country: { type: String, trim: true },
  },
  email: { type: String, trim: true, lowercase: true },
  vatNumber: { type: String, trim: true, uppercase: true },
  notes: { type: String, trim: true },
  paymentTerms: { type: String, trim: true },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
  assigned: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

schema.index({ name: 1 });
schema.index({ email: 1 });
schema.index({ vatNumber: 1 });

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Client', schema);
