const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: { type: Boolean, default: false },
  enabled: { type: Boolean, default: true },
  name: { type: String, required: true, trim: true },
  contactName: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  address: { type: String, trim: true },
  postalCode: { type: String, trim: true },
  city: { type: String, trim: true },
  country: { type: String, trim: true, default: 'AT' },
  vatNumber: { type: String, trim: true, uppercase: true },
  supplierNumber: { type: String, trim: true, uppercase: true },
  paymentTerms: { type: String, trim: true },
  notes: { type: String, trim: true },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

schema.index({ name: 1 });
schema.index({ supplierNumber: 1 }, { unique: true, sparse: true });
module.exports = mongoose.model('Supplier', schema);
