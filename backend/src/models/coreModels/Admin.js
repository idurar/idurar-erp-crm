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
  },
  name: { type: String, required: true },
  surname: { type: String },
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
    default: 'owner',
    enum: ['owner', 'admin', 'accounting', 'sales', 'warehouse', 'technician', 'viewer'],
  },
  employmentType: {
    type: String,
    enum: ['full_time', 'part_time', 'marginal', 'custom'],
    default: 'full_time',
  },
  weeklyTargetHours: { type: Number, min: 0, max: 168, default: 40 },
  workDaysPerWeek: { type: Number, min: 1, max: 7, default: 5 },
  vacationModel: {
    type: String,
    enum: ['five_weeks', 'six_weeks', 'custom'],
    default: 'five_weeks',
  },
  annualVacationDays: { type: Number, min: 0, max: 366, default: 25 },
  employmentStart: { type: Date },
  timeAccountStart: { type: Date },
  initialTimeBalance: { type: Number, default: 0 },
  vacationCarryover: { type: Number, default: 0 },
});

adminSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { removed: false } }
);

module.exports = mongoose.model('Admin', adminSchema);
