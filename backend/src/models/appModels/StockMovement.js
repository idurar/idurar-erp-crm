const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: { type: Boolean, default: false },
  article: { type: mongoose.Schema.ObjectId, ref: 'Article', required: true, index: true },
  quantity: { type: Number, required: true },
  type: { type: String, enum: ['opening', 'adjustment', 'invoice', 'credit_note'], required: true },
  sourceModel: String,
  sourceId: mongoose.Schema.ObjectId,
  sourceLineId: String,
  note: String,
  effectiveAt: { type: Date, required: true, default: Date.now, index: true },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
  created: { type: Date, default: Date.now },
});

schema.index({ sourceModel: 1, sourceId: 1, sourceLineId: 1, type: 1 }, { unique: true, sparse: true });
module.exports = mongoose.model('StockMovement', schema);
