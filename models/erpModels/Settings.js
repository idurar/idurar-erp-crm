const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const settingsSchema = new mongoose.Schema({
  settingsID: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    lowercase: true,
  },
  name: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    required: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

module.exports = mongoose.model('Settings', settingsSchema);
