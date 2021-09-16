const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const departmentSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

module.exports = mongoose.model("Department", departmentSchema);
