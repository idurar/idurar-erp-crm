const mongoose = require('mongoose');
const { nanoid } = require('nanoid');
const { z } = require('zod');
const firstNameSchema = z.string().min(1).max(50);
const lastNameSchema = z.string().min(1).max(50);
const phoneNoschema = z.number().int().positive();
const emailschema = z.string().email();
const countrySchema = z.string().min(2).max(2);
const schema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },

  firstname: {
    type: String,
    trim: true,
    required: true,
    validate: {
      validator: (value) => firstNameSchema.safeParse(value).success,
      message: (props) => `Invalid first name: ${firstNameSchema.safeParse(props.value).error}`,
    },
  },
  lastname: {
    type: String,
    trim: true,
    required: true,
    validate: {
      validator: (value) => lastNameSchema.safeParse(value).success,
      message: (props) => `Invalid last name: ${lastNameSchema.safeParse(props.value).error}`,
    },
  },
  isClient: {
    type: Boolean,
    default: false,
  },
  company: { type: mongoose.Schema.ObjectId, ref: 'Company' },
  bio: String,
  idCardNumber: {
    type: String,
    trim: true,
  },
  idCardType: {
    type: String,
  },
  securitySocialNbr: {
    type: String,
  },
  taxNumber: {
    type: String,
  },
  birthday: {
    type: Date,
  },
  birthplace: {
    type: String,
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
  },
  photo: {
    type: String,
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
        default: 'string',
      },
      fieldValue: {},
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
  postalCode: {
    type: Number,
  },
  country: {
    type: String,
    trim: true,
    validate: {
      validator: (value) => countrySchema.safeParse(value).success,
      message: (props) => `Invalid country: ${countrySchema.safeParse(props.value).error}`,
    },
  },
  phone: {
    type: Number,
    trim: true,
    validate: {
      validator: (value) => phoneNoschema.safeParse(value).success,
      message: (props) => `Invalid phone number: ${phoneNoschema.safeParse(props.value).error}`,
    },
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
    validate: {
      validator: (value) => emailschema.safeParse(value).success,
      message: (props) => `Invalid email: ${emailschema.safeParse(props.value).error}`,
    },
  },

  otherEmail: [
    {
      type: String,
      trim: true,
      lowercase: true,
    },
  ],
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    linkedin: String,
    tiktok: String,
    youtube: String,
    snapchat: String,
  },
  website: {
    type: String,
    trim: true,
    lowercase: true,
  },
  images: [
    {
      id: String,
      name: String,
      path: String,
      description: String,
      isPublic: {
        type: Boolean,
        default: false,
      },
    },
  ],
  files: [
    {
      id: String,
      name: String,
      path: String,
      description: String,
      isPublic: {
        type: Boolean,
        default: false,
      },
    },
  ],
  notes: String,
  category: String,
  status: String,
  approved: {
    type: Boolean,
  },
  verified: {
    type: Boolean,
  },
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

schema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('People', schema);
