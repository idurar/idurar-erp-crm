const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const emailSchema = new mongoose.Schema({
  emailKey: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
  },
  emailName: {
    type: String,
    unique:true,
    required:true,
  },
  emailVariables:{
    type:Array
  },
  emailBody: {
    type: String,
    required: true,
  },
  emailSubject: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

module.exports = mongoose.model('Email', emailSchema);
