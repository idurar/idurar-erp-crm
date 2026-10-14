const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: { type: Boolean, default: false },
  name: { type: String, required: true, trim: true, unique: true },
  description: { type: String, trim: true },
  color: { type: String, default: '#1677ff' },
  trackStock: { type: Boolean, default: true },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ArticleCategory', schema);
