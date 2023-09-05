const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const uploadSchema = new mongoose.Schema({
  modelName: {
    type: String,
    trim: true,
  },
  fieldId: {
    type: String,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  isPublic: {
    type: Boolean,
  },
  userID: {
    type: mongoose.SchemaTypes.ObjectId,
  },
  isSecure: {
    type: String,
  },
  removed: {
    type: String,
  },
  path: {
    type: String,
  },
});

module.exports = mongoose.model('Upload ', uploadSchema);
