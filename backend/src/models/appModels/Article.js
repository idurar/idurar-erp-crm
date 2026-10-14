const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: { type: Boolean, default: false },
  number: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  supplierNumber: { type: String, trim: true },
  category: { type: mongoose.Schema.ObjectId, ref: 'ArticleCategory', autopopulate: true },
  weight: { type: Number, min: 0 },
  weightUnit: {
    type: String,
    enum: ['g', 'kg', 'ml', 'l', 'deg', 'tonne'],
    default: 'kg',
  },
  length: { type: Number, min: 0 },
  width: { type: Number, min: 0 },
  height: { type: Number, min: 0 },
  depth: { type: Number, min: 0 },
  material: { type: String, trim: true },
  purchasePrice: { type: Number, min: 0, default: 0 },
  salesPrice: { type: Number, min: 0, default: 0 },
  packageQuantity: { type: Number, min: 0.01, default: 1 },
  purchasePackPrice: { type: Number, min: 0, default: 0 },
  salesPackPrice: { type: Number, min: 0, default: 0 },
  margin: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

schema.pre('save', function (next) {
  this.margin = this.salesPrice > 0 ? ((this.salesPrice - this.purchasePrice) / this.salesPrice) * 100 : 0;
  next();
});
schema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Article', schema);
