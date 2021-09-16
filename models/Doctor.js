const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const doctorSchema = new mongoose.Schema({
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
  },
  surname: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  birthday: {
    type: String,
    trim: true,
    required: true,
  },
  birthplace: {
    type: String,
    trim: true,
  },
  gender: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    trim: true,
  },
  specialty: {
    type: mongoose.Schema.ObjectId,
    ref: "Specialty",
    required: true,
  },
  address: {
    type: String,
    trim: true,
  },
  state: {
    type: String,
  },
  phone: {
    type: String,
    trim: true,
  },
  urgentContact: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// find employee where the doctor _id property === employee doctor property
function autopopulate(next) {
  this.populate("specialty");
  next();
}

doctorSchema.pre("find", autopopulate);
doctorSchema.pre("findOne", autopopulate);

module.exports = mongoose.model("Doctor", doctorSchema);
