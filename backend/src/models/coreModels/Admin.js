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
  branchs: [{ type: mongoose.Schema.ObjectId, ref: 'Branch' }],
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true,
  },
  name: { type: String, required: true, lowercase: true },
  surname: { type: String, lowercase: true },
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
    default: 'staff',
    enum: ['superadmin', 'admin', 'staffAdmin', 'staff', 'createOnly', 'readOnly'],
  },
});

module.exports = mongoose.model('Admin', adminSchema);
