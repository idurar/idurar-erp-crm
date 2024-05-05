const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },

  productCategory: {
    type: mongoose.Schema.ObjectId,
    ref: 'ProductCategory',
    required: true,
    autopopulate: true,
  },
  suppliers: [{ type: mongoose.Schema.ObjectId, ref: 'Supplier' }],
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  number: {
    type: Number,
  },
  title: String,
  tags: [String],
  headerImage: String,
  photo: String,
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
  priceBeforeTax: {
    type: Number,
  },
  taxRate: { type: Number, default: 0 },
  price: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    uppercase: true,
    required: true,
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
    default: true,
  },
});

schema.index({ name: 1 }, { unique: true });

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Product', schema);
