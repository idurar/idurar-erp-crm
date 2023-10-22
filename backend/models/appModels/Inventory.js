const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const inventorySchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  product: {
    type: String,
    trim: true,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0, // Ensure non-negative numbers
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0, // Ensure non-negative numbers
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Inventory', inventorySchema);
