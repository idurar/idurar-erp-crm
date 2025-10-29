const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  tasks: [{
    type: Schema.Types.ObjectId,
    ref: 'Task',
  }],
});

module.exports = mongoose.model('Project', projectSchema);
