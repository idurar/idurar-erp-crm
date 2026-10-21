const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: { type: Boolean, default: false },
  article: { type: mongoose.Schema.ObjectId, ref: 'Article', required: true, index: true },
  project: { type: mongoose.Schema.ObjectId, ref: 'Project', index: true },
  commission: { type: String, trim: true, index: true },
  quantity: { type: Number, required: true },
  unitCost: { type: Number, min: 0 },
  totalValue: { type: Number },
  resultingUnitCost: { type: Number, min: 0 },
  type: { type: String, enum: ['opening', 'adjustment', 'invoice', 'credit_note', 'purchase_receipt'], required: true },
  sourceModel: String,
  sourceId: mongoose.Schema.ObjectId,
  sourceLineId: String,
  note: String,
  effectiveAt: { type: Date, required: true, default: Date.now, index: true },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
  created: { type: Date, default: Date.now },
});

schema.index(
  { sourceModel: 1, sourceId: 1, sourceLineId: 1, type: 1 },
  {
    name: 'stock_movement_source_unique',
    unique: true,
    partialFilterExpression: {
      sourceModel: { $type: 'string' },
      sourceId: { $type: 'objectId' },
      sourceLineId: { $type: 'string' },
    },
  }
);
module.exports = mongoose.model('StockMovement', schema);
