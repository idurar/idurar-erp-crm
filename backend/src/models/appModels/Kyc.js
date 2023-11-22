const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const kycSchema = new mongoose.Schema({
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
  // Fields for shipping
  name: {
    type: String,
    trim: true,
    required: true,
  },
  address: {
    type: String,
    trim: true,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model('Kyc', kycSchema);
