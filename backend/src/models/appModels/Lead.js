const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
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
  interestedIn: [{ type: mongoose.Schema.ObjectId, ref: 'Product' }],
  converted: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
  adminOwner: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
  images: [
    {
      name: String,
      path: String,
      description: String,
      tags: [
        {
          type: String,
          trim: true,
          lowercase: true,
        },
      ],
      created: Date,
      updated: Date,
    },
  ],
  files: [
    {
      name: String,
      path: String,
      description: String,
      tags: [
        {
          type: String,
          trim: true,
          lowercase: true,
        },
      ],
      created: Date,
      updated: Date,
    },
  ],
  category: String,
  status: String,
  progressStatus: String,
  finalStatus: String,
  notes: String,
  source: String,
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

module.exports = mongoose.model('Lead', leadSchema);
