const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const prescriptionSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  consultation: {
    type: mongoose.Schema.ObjectId,
    ref: "Consultation",
    required: true,
    autopopulate: true,
  },
  doctor: {
    type: mongoose.Schema.ObjectId,
    ref: "Doctor",
    required: true,
    autopopulate: true,
  },
  patient: {
    type: mongoose.Schema.ObjectId,
    ref: "Patient",
    required: true,
    autopopulate: true,
  },
  type: {
    type: String,
    trim: true,
  },
  medicamentsList: [
    {
      medicamentName: {
        type: String,
        required: true,
      },
      boxesNumber: {
        type: Number,
        default: 1,
      },
      daysNumber: {
        type: Number,
      },
      drugsNumber: {
        type: Number,
      },
      times: {
        type: Number,
      },
      note: {
        type: String,
      },
    },
  ],
  letter: {
    type: String,
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

// this package will do
prescriptionSchema.plugin(require("mongoose-autopopulate"));
module.exports = mongoose.model("Prescription", prescriptionSchema);
