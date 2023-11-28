const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  branchs: [{ type: mongoose.Schema.ObjectId, ref: 'Branch' }],
  type: {
    type: String,
    default: 'company',
    enum: ['company', 'people'],
    required: true,
  },
  company: { type: mongoose.Schema.ObjectId, ref: 'Company', unique: true, autopopulate: true },
  people: { type: mongoose.Schema.ObjectId, ref: 'People', unique: true, autopopulate: true },
  convertedFrom: { type: mongoose.Schema.ObjectId, ref: 'Lead' },
  interestedIn: [{ type: mongoose.Schema.ObjectId, ref: 'Product', autopopulate: true }],
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin', required: true, autopopulate: true },
  assigned: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
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

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Client', schema);
