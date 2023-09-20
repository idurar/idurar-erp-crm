const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const taxSchema = new mongoose.Schema({
  taxName: {
    type: String,
    default: false,
  },
  taxValue: {
    type: Number,
    default: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
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

module.exports = mongoose.model('Tax', taxSchema);
