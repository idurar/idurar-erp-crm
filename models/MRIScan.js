const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const mriScanSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
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
  date: {
    type: Date,
    default: Date.now,
  },
  mriScansList: [
    {
      mriScanType: {
        type: mongoose.Schema.ObjectId,
        ref: "MRIScanType",
        required: true,
      },
      result: {
        type: String,
        required: true,
      },
      image: [String],
    },
  ],
  total: {
    type: Number,
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
    required: true,
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
  pdfPath: {
    type: String,
    default: "",
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("MRIScan", mriScanSchema);
