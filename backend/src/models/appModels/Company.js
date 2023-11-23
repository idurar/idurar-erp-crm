const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const CompanySchema = new mongoose.Schema({
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
    unique: true,
    required: true,
  },
  legalName: {
    type: String,
    trim: true,
    required: true,
  },
  hasParentCompany: {
    type: Boolean,
    default: false,
  },
  parentCompany: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company',
  },
  peoples: [{ type: mongoose.Schema.ObjectId, ref: 'People' }],
  defaultContact: { type: mongoose.Schema.ObjectId, ref: 'People' },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
  icon: {
    type: String,
    trim: true,
  },
  logo: {
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
  bankCountry: {
    type: String,
    trim: true,
  },
  companyRegNumber: {
    type: String,
    trim: true,
  },
  companyTaxNumber: {
    type: String,
    trim: true,
  },
  companyTaxId: {
    type: String,
    trim: true,
  },
  companyRegId: {
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
  fax: {
    type: String,
    trim: true,
  },
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
  verified: {
    type: Boolean,
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

module.exports = mongoose.model('Company', CompanySchema);
