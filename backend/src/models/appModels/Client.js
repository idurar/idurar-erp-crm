import mongoose from 'mongoose';
import mongooseAutoPopulate from 'mongoose-autopopulate';

const clientSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  branchs: [{ type: mongoose.Schema.ObjectId, ref: 'Branch' }],
  type: {
    type: String,
    default: 'company',
    enum: ['company', 'people'],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  company: { type: mongoose.Schema.ObjectId, ref: 'Company', autopopulate: true },
  people: { type: mongoose.Schema.ObjectId, ref: 'People', autopopulate: true },
  convertedFrom: { type: mongoose.Schema.ObjectId, ref: 'Lead' },
  interestedIn: [{ type: mongoose.Schema.ObjectId, ref: 'Product' }],
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
  assigned: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
  source: String,
  category: String,
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

clientSchema.plugin(mongooseAutoPopulate);

export default mongoose.model('Client', clientSchema);
