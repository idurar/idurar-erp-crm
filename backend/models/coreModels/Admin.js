const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const bcrypt = require('bcryptjs');

const adminSchema = new Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
    lowercase: true,
  },
  surname: {
    type: String,
    required: true,
    lowercase: true,
  },
  company: {
    type: String,
    required: true,
    lowercase: true,
  },
  companyRegNumber: {
    type: String,
    required: true,
    lowercase: true,
  },
  bankAccount: {
    type: String,
    required: true,
    lowercase: true,
  },
  companyTaxNumber: {
    type: String,
    required: true,
    lowercase: true,
  },
  address: {
    type: String,
    required: true,
    lowercase: true,
  },
  zipcode: {
    type: String,
    required: true,
    lowercase: true,
  },
  city: {
    type: String,
    required: true,
    lowercase: true,
  },
  country: {
    type: String,
    required: true,
    lowercase: true,
  },
  website: {
    type: String,
    required: true,
    lowercase: true,
  },
  photo: {
    type: String,
    trim: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: 'staff',
    enum: ['admin', 'staffAdmin', 'staff', 'createOnly', 'readOnly'],
  },
  isLoggedIn: { type: Number },
  loggedSessions: {
    type: [String],
    default: [],
  },
});

adminSchema.plugin(require('mongoose-autopopulate'));

// generating a hash
adminSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(), null);
};

// checking if password is valid
adminSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
