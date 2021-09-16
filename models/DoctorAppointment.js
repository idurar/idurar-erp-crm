const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const doctorAppointmentSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
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
  timingRange: [
    {
      from: {
        type: String,
        required: true,
      },
      to: {
        type: String,
        required: true,
      },
      appointment: {
        type: mongoose.Schema.ObjectId,
        ref: "Appointment",
      },
      enabled: {
        type: Boolean,
        default: true,
      },
    },
  ],
  status: {
    type: String,
    default: 0,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

// find employee where the doctor _id property === employee doctor property
/*function autopopulate(next) {
  this.populate('patient');
  this.populate('doctor');
  this.populate('specialty');
  next();
} */

// this package will do
doctorAppointmentSchema.plugin(require("mongoose-autopopulate"));

/*appointmentSchema.pre('find', autopopulate);
appointmentSchema.pre('findOne', autopopulate);
appointmentSchema.pre('findOneAndUpdate', autopopulate);*/

module.exports = mongoose.model("DoctorAppointment", doctorAppointmentSchema);
