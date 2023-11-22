const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const employeeSchema = new mongoose.Schema({
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
    trim: true,
    required: true,
  },
  surname: {
    type: String,
    trim: true,
    required: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
  birthplace: {
    type: String,
  },
  gender: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    trim: true,
  },
  department: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    trim: true,
  },
  state: {
    type: String,
  },
  phone: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  urgentContact: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    default: '1',
  },
  created: {
    type: Date,
    default: Date.now,
  },
});
employeeSchema.plugin(require('mongoose-autopopulate'));
employeeSchema.index({
  name: 'text',
  surname: 'text',
  birthday: 'text',
  status: 'text',
});

module.exports = mongoose.model('Employee', employeeSchema);
