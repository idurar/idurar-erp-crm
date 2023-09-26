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
  removed: {
    type: Boolean,
    default: false,
    },
  enabled: {
    type: Boolean,
    default: true,
    },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Tax', taxSchema);
