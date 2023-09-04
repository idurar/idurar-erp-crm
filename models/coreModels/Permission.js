const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const permissionSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  displayName: {
    type: String,
    trim: true,
    required: true,
  },
  apiGroup: {
    type: String,
    trim: true,
    required: true,
  },
  apiMethod: {
    type: String,
    trim: true,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Permission', permissionSchema);
