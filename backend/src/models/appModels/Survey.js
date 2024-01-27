const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  user: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
  result: [{
    question: String,
    answer : String,
  }],
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

schema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Survey', schema);
