const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: { type: Boolean, default: false },
  enabled: { type: Boolean, default: true },
  name: { type: String, required: true, trim: true },
  accountCode: { type: String, trim: true },
  description: { type: String, trim: true },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

schema.index({ name: 1 }, { unique: true, partialFilterExpression: { removed: false } });
module.exports = mongoose.model('ExpenseCategory', schema);
