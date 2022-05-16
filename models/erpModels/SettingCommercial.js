const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const settingCommercial = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  name: {
    type: Array,
    default: true,
  },
  displayName: {
    type: String,
    trim: true,
    required: true,
  },
  value: {
    type: String,
    trim: true,
    required: true,
  },
  tableName: {
    type: String,
    trim: true,
  },
  relationID: {
    type: String,
    trim: true,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model('SettingCommercial', settingCommercial);
