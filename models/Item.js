const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const itemSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  itemName: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
  },
  currency: {
    type: mongoose.Schema.ObjectId,
    ref: "Currency",
  },
});

module.exports = mongoose.model("Item", itemSchema);
