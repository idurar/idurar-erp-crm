const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const analysisSchema = new mongoose.Schema({
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
  consultation: {
    type: mongoose.Schema.ObjectId,
    ref: "Consultation",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  analysesList: [
    {
      analysisType: {
        type: mongoose.Schema.ObjectId,
        ref: "AnalysisType",
        required: true,
        autopopulate: true,
      },
      result: {
        type: String,
      },
    },
  ],
  total: {
    type: Number,
    required: true,
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
analysisSchema.plugin(require("mongoose-autopopulate"));
module.exports = mongoose.model("Analysis", analysisSchema);
