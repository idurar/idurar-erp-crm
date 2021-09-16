const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const mriScanTypeSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  reference: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    trim: true,
    default: "1",
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("MRIScanType", mriScanTypeSchema);
