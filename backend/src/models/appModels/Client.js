const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  type: {
    type: String,
    default: 'company',
    enum: ['company', 'people'],
  },
  company: { type: mongoose.Schema.ObjectId, ref: 'Company' },
  people: { type: mongoose.Schema.ObjectId, ref: 'People' },
  convertedFrom: { type: mongoose.Schema.ObjectId, ref: 'Lead' },
  interestedIn: [{ type: mongoose.Schema.ObjectId, ref: 'Product' }],
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin', required: true },
  owner: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
  images: [
    {
      id: String,
      name: String,
      path: String,
      description: String,
      isPublic: {
        type: Boolean,
        default: false,
      },
    },
  ],
  files: [
    {
      id: String,
      name: String,
      path: String,
      description: String,
      isPublic: {
        type: Boolean,
        default: false,
      },
    },
  ],
  source: String,
  category: String,
  notes: String,
  approved: {
    type: Boolean,
    default: false,
  },
  tags: [
    {
      type: String,
      trim: true,
      lowercase: true,
    },
  ],
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Client', ClientSchema);
