const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const laboratoryConsultationSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  patient: {
    type: mongoose.Schema.ObjectId,
    ref: "Patient",
    required: true,
  },
  employee: {
    type: mongoose.Schema.ObjectId,
    ref: "Employee",
  },
  analysis: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Analysis",
    },
  ],
  total: {
    type: Number,
    default: 0,
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
    type: Number,
    default: 0,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

function autopopulate(next) {
  this.populate("patient");
  this.populate("employee");
  this.populate("analysis");
  next();
}

laboratoryConsultationSchema.pre("find", autopopulate);
laboratoryConsultationSchema.pre("findOne", autopopulate);
laboratoryConsultationSchema.pre("findOneAndUpdate", autopopulate);

module.exports = mongoose.model(
  "LaboratoryConsultation",
  laboratoryConsultationSchema
);
