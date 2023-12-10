const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  emailKey: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
  },
  emailName: {
    type: String,
    unique: true,
    required: true,
  },
  emailVariables: {
    type: Array,
  },
  emailBody: {
    type: String,
    required: true,
  },
  emailSubject: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    default: 'us_en',
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Email', emailSchema);
