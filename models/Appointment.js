const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const appointmentSchema = new mongoose.Schema({
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
  specialty: {
    type: mongoose.Schema.ObjectId,
    ref: "Specialty",
    autopopulate: true,
  },
  doctor: {
    type: mongoose.Schema.ObjectId,
    ref: "Doctor",
    autopopulate: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 0,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

appointmentSchema.index({
  date: "text",
  status: "text",
});
// find employee where the doctor _id property === employee doctor property
/*function autopopulate(next) {
  this.populate('patient');
  this.populate('doctor');
  this.populate('specialty');
  next();
} */

// this package will do
appointmentSchema.plugin(require("mongoose-autopopulate"));

/*appointmentSchema.pre('find', autopopulate);
appointmentSchema.pre('findOne', autopopulate);
appointmentSchema.pre('findOneAndUpdate', autopopulate);*/

module.exports = mongoose.model("Appointment", appointmentSchema);
