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
  phone: String,
  country: String,
  address: String,
  postalCode: { type: String, trim: true },
  city: { type: String, trim: true },
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
