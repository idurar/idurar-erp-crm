const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: { type: Boolean, default: false },
  enabled: { type: Boolean, default: true },
  number: { type: String, required: true, trim: true, uppercase: true },
  name: { type: String, required: true, trim: true },
  client: { type: mongoose.Schema.ObjectId, ref: 'Client', required: true, autopopulate: true },
  status: {
    type: String,
    enum: ['planned', 'active', 'paused', 'completed', 'cancelled'],
    default: 'planned',
  },
  startDate: Date,
  endDate: Date,
  address: { type: String, trim: true },
  budget: { type: Number, min: 0, default: 0 },
  notes: { type: String, trim: true },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

schema.index({ number: 1 }, { unique: true, partialFilterExpression: { removed: false } });
schema.index({ client: 1, status: 1 });
schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Project', schema);
