const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const consultationRecordingSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  consultation: {
    type: mongoose.Schema.ObjectId,
    ref: "Consultation",
    required: true,
  },
  name: {
    type: String,
    default: 0,
    required: true,
  },
  audioFile: {
    type: String,
    trim: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "ConsultationRecording",
  consultationRecordingSchema
);
