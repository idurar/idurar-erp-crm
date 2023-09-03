const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const roleSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  codeName: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
  },
  displayName: {
    type: String,
    trim: true,
    required: true,
  },
  dashboardType: {
    type: String,
    trim: true,
  },
  authorizedPages: [{ type: String, lowercase: true, trim: true }],
  permissions: [{ type: mongoose.Schema.ObjectId, ref: 'Permission' }],
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Role', roleSchema);
