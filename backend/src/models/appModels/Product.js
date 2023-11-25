const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  branchs: [{ type: mongoose.Schema.ObjectId, ref: 'Branch' }],
  productCategory: { type: mongoose.Schema.ObjectId, ref: 'ProductCategory', required: true },
  suppliers: [{ type: mongoose.Schema.ObjectId, ref: 'Supplier' }],
  name: {
    type: String,
    required: true,
  },
  description: String,
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
    required: true,
  },
  taxRate: { type: mongoose.Schema.ObjectId, ref: 'Tax' },
  price: {
    type: Number,
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
    default: false,
  },
});

module.exports = mongoose.model('Product', productSchema);
