const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const paymentSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  number: {
    type: Number,
    required: true,
  },
  year: {
    type: Date,
    default: Date.now,
  },
  employee: {
    type: mongoose.Schema.ObjectId,
    ref: "Employee",
  },
  patient: {
    type: mongoose.Schema.ObjectId,
    ref: "Patient",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: mongoose.Schema.ObjectId,
    ref: "Currency",
  },
  paymentMode: {
    type: mongoose.Schema.ObjectId,
    ref: "PaymentMode",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  ref: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
  },
  forLaboratory: {
    type: Boolean,
    default: false,
  },
  forMRIScan: {
    type: Boolean,
    default: false,
  },
  forConsultation: {
    type: Boolean,
    default: false,
  },
  mriScan: {
    type: mongoose.Schema.ObjectId,
    ref: "MRIScan",
  },
  analysis: {
    type: mongoose.Schema.ObjectId,
    ref: "Analysis",
  },
  consultation: {
    type: mongoose.Schema.ObjectId,
    ref: "Consultation",
  },
  doctor: {
    type: mongoose.Schema.ObjectId,
    ref: "Doctor",
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
