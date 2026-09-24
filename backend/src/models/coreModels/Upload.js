import { Schema, SchemaTypes, model } from 'mongoose';

const uploadSchema = new Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },

  modelName: {
    type: String,
    trim: true,
  },
  fieldId: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    enum: [
      'jpeg',
      'jpg',
      'png',
      'gif',
      'webp',
      'doc',
      'txt',
      'csv',
      'docx',
      'xls',
      'xlsx',
      'pdf',
      'zip',
      'rar',
      'mp4',
      'mov',
      'avi',
      'mp3',
      'm4a',
      'webm',
    ],
    required: true,
  },
  isPublic: {
    type: Boolean,
    required: true,
  },
  userID: {
    type: SchemaTypes.ObjectId,
    required: true,
  },
  isSecure: {
    type: Boolean,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

export default model('Upload ', uploadSchema);
