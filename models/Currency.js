const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const currencySchema = new mongoose.Schema({
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
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  decimalSeparator: {
    type: String,
    default: ".",
  },
  thousandSeparator: {
    type: String,
    default: " ",
    trim: false,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Currency", currencySchema);
