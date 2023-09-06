
/*
Create a new model named Upload within the coreModels directory. This model will have the following fields:

modelName: The name of the model.
fieldId: The ID of the field.
enabled: A flag indicating whether the upload is enabled or not.
isPublic: A flag indicating whether isPublic or protected.
userID : userID who upload
isSecure : if true , only users who upload can see
removed: A flag indicating whether the upload has been removed or not.
path: The path to the uploaded file.
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const uploadSchema = new Schema({
  modelName: {
    type: String,
    required: true,
  },
  fieldId: {
    type: String,
    required: true,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  userID: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  isSecure: {
    type: Boolean,
    default: false,
  },
  removed: {
    type: Boolean,
    default: false,
  },
  path: {
    type: String,
    required: true,
  },
}); 

module.exports = mongoose.model('Upload', uploadSchema);

