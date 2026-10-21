const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: { type: Boolean, default: false },
  enabled: { type: Boolean, default: true },
  project: { type: mongoose.Schema.ObjectId, ref: 'Project', autopopulate: true },
  employee: { type: mongoose.Schema.ObjectId, ref: 'Admin', required: true, autopopulate: true },
  workDate: { type: Date, required: true },
  startTime: { type: String, required: true, match: /^([01]\d|2[0-3]):[0-5]\d$/ },
  endTime: { type: String, required: true, match: /^([01]\d|2[0-3]):[0-5]\d$/ },
  breakMinutes: { type: Number, min: 0, max: 120, default: 0 },
  entryType: {
    type: String,
    enum: ['work', 'vacation', 'sick', 'holiday', 'overtime', 'correction'],
    default: 'work',
  },
  hours: { type: Number, required: true, min: 0.01, max: 24 },
  description: { type: String, trim: true, maxlength: 1000, default: '' },
  billable: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

schema.index({ project: 1, workDate: -1 });
schema.index({ employee: 1, workDate: -1 });
schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('TimeEntry', schema);
