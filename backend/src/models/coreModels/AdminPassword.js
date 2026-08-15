const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcryptjs');

const AdminPasswordSchema = new Schema({
  removed: {
    type: Boolean,
    default: false,
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
  emailToken: String,
  resetToken: String,
  emailVerified: {
    type: Boolean,
    default: false,
  },
  authType: {
    type: String,
    default: 'email',
    enum: ['email', 'google'],
  },
  loggedSessions: {
    type: [String],
    default: [],
  },
});

// AdminPasswordSchema.index({ user: 1 });
// generating a hash
AdminPasswordSchema.methods.generateHash = function (salt, password) {
  return bcrypt.hashSync(salt + password);
};

// checking if password is valid
AdminPasswordSchema.methods.validPassword = function (salt, userpassword) {
  return bcrypt.compareSync(salt + userpassword, this.password);
};

// Static method to generate a hash from static context
AdminPasswordSchema.statics.generateHash = function (password) {
  const salt = require('shortid').generate();
  return { passwordHash: bcrypt.hashSync(salt + password), salt };
};

module.exports = mongoose.model('AdminPassword', AdminPasswordSchema);
