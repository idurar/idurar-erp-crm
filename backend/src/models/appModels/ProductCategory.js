const mongoose = require('mongoose');

const productCategorySchema = new mongoose.Schema({
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
    required: true,
    unique: true,
  },
  description: String,
  color: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
  },
  hasParentCategory: {
    type: Boolean,
    default: false,
  },
  parentCategory: {
    type: mongoose.Schema.ObjectId,
    ref: 'ProductCategory',
  },

  title: String,
  tags: [String],
  icon: String,
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

productCategorySchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model('ProductCategory', productCategorySchema);
