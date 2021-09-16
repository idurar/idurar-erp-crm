const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const consultationTypeSchema = new mongoose.Schema({
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
  description: {
    type: String,
    trim: true,
  },
  specialty: {
    type: mongoose.Schema.ObjectId,
    ref: "Specialty",
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
function autopopulate(next) {
  this.populate("specialty");
  next();
}

consultationTypeSchema.pre("find", autopopulate);
consultationTypeSchema.pre("findOne", autopopulate);
consultationTypeSchema.pre("findOneAndUpdate", autopopulate);

module.exports = mongoose.model("ConsultationType", consultationTypeSchema);
