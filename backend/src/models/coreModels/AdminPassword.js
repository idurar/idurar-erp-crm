const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcryptjs');

const AdminPasswordSchema = new Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  user: { type: mongoose.Schema.ObjectId, ref: 'Admin', required: true, unique: true },
  password: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  emailVerified: {
    type: Boolean,
    trim: true,
  },
  authType: {
    type: String,
    default: 'email',
  },
  loggedSessions: {
    type: [String],
    default: [],
  },
});

// generating a hash
AdminPasswordSchema.methods.generateHash = function (salt, password) {
  return bcrypt.hashSync(salt + password, bcrypt.genSaltSync(), null);
};

// checking if password is valid
AdminPasswordSchema.methods.validPassword = function (salt, userpassword) {
  return bcrypt.compareSync(salt + userpassword, this.password);
};

module.exports = mongoose.model('AdminPassword', AdminPasswordSchema);
