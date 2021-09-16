const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const recording = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  file: {
    type: String,
    trim: true,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Recording", recording);
