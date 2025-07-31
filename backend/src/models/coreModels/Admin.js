const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: false,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: true, // ADDED THIS LINE - ensure unique emails
  },
  name: { type: String, required: true },
  surname: { type: String },
  // ADDED THIS FIELD - Country field for registration
  country: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    trim: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: 'admin', // CHANGE FROM 'owner' to 'admin'
    enum: ['admin', 'owner'], // ADD 'admin' to allowed values
  },
});

module.exports = mongoose.model('Admin', adminSchema);