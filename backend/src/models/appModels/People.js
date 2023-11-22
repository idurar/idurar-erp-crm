const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const PeopleSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
  firstname: {
    type: String,
    trim: true,
    required: true,
  },
  lastname: {
    type: String,
    trim: true,
    required: true,
  },
  birthday: {
    type: Date,
  },
  birthplace: {
    type: String,
  },
  gender: {
    type: String,
  },
  photo: {
    type: String,
    trim: true,
  },
  bankName: {
    type: String,
    trim: true,
  },
  bankIban: {
    type: String,
    trim: true,
  },
  bankSwift: {
    type: String,
    trim: true,
  },
  bankNumber: {
    type: String,
    trim: true,
  },
  bankRouting: {
    type: String,
    trim: true,
  },
  customField: [
    {
      fieldName: {
        type: String,
        trim: true,
        lowercase: true,
      },
      fieldType: {
        type: String,
        trim: true,
        lowercase: true,
      },
      fieldValue: String,
    },
  ],
  location: {
    latitude: Number,
    longitude: Number,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  State: {
    type: String,
  },
  postaCode: {
    type: Number,
  },
  country: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  otherPhone: [
    {
      type: String,
      trim: true,
    },
  ],
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },

  otherEmail: [
    {
      type: String,
      trim: true,
      lowercase: true,
    },
  ],
  website: {
    type: String,
    trim: true,
    lowercase: true,
  },
  images: [
    {
      name: String,
      path: String,
      description: String,
      tags: [
        {
          type: String,
          trim: true,
          lowercase: true,
        },
      ],
      created: Date,
      updated: Date,
    },
  ],
  files: [
    {
      name: String,
      path: String,
      description: String,
      tags: [
        {
          type: String,
          trim: true,
          lowercase: true,
        },
      ],
      created: Date,
      updated: Date,
    },
  ],
  category: String,
  status: String,
  progressStatus: String,
  finalStatus: String,
  approved: {
    type: Boolean,
    default: true,
  },
  notes: String,
  tags: [
    {
      type: String,
      trim: true,
      lowercase: true,
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
  isPublic: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('People', PeopleSchema);