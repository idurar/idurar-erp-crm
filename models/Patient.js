const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const patientSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  patientId: {
    type: String,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  surname: {
    type: String,
    trim: true,
    required: true,
  },
  birthday: {
    type: String,
    trim: true,
    required: true,
  },
  birthplace: {
    type: String,
    trim: true,
  },
  sexe: {
    type: String,
    required: true,
  },
  boldType: {
    type: String,
    trim: true,
  },
  size: {
    type: String,
    trim: true,
  },
  weight: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  state: {
    type: String,
  },
  job: {
    type: String,
    trim: true,
  },
  urgentContact: {
    type: String,
    trim: true,
  },
  tel: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

patientSchema.index({
  name: "text",
  surname: "text",
  birthday: "text",
});

module.exports = mongoose.model("Patient", patientSchema);
