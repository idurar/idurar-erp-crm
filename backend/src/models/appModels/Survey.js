import mongoose from 'mongoose';
import mongooseAutoPopulate from 'mongoose-autopopulate';

const surveySchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  user: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
  result: [
    {
      question: String,
      answer: String,
    },
  ],
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Survey', surveySchema);
