const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const consultationSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  patient: {
    type: mongoose.Schema.ObjectId,
    ref: "Patient",
    required: true,
    autopopulate: true,
  },
  doctor: {
    type: mongoose.Schema.ObjectId,
    ref: "Doctor",
    required: true,
    autopopulate: true,
  },
  date: {
    type: String,
    trim: true,
    required: true,
  },
  consultationType: {
    type: mongoose.Schema.ObjectId,
    ref: "ConsultationType",
    autopopulate: true,
  },
  prescription: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Prescription",
    },
  ],
  total: {
    type: Number,
    default: 0,
    required: true,
  },
  payment: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Payment",
    },
  ],
  credit: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  paymentStatus: {
    type: String,
    trim: true,
    default: "0",
  },
  report: {
    type: String,
  },
  reportConverted: {
    type: Boolean,
    default: false,
  },
  audioFile: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "ConsultationRecording",
    },
  ],
  created: {
    type: Date,
    default: Date.now,
  },
});

consultationSchema.plugin(require("mongoose-autopopulate"));

module.exports = mongoose.model("Consultation", consultationSchema);
