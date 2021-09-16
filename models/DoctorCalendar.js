const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const doctorCalendarSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  doctor: {
    type: mongoose.Schema.ObjectId,
    ref: "Doctor",
    autopopulate: true,
  },
  year: {
    type: String,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  days: [
    {
      day: {
        type: String,
        required: true,
      },
      hoursRange: {
        type: String,
        required: true, // 9-12,14-17
      },
    },
  ],
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
doctorCalendarSchema.plugin(require("mongoose-autopopulate"));

/*appointmentSchema.pre('find', autopopulate);
appointmentSchema.pre('findOne', autopopulate);
appointmentSchema.pre('findOneAndUpdate', autopopulate);*/

module.exports = mongoose.model("DoctorCalendar", doctorCalendarSchema);
