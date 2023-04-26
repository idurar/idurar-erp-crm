const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const noCodeCollectionsSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  collectionId: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  appId: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  parms: { type: mongoose.Schema.Types.Mixed },
  formField: [
    {
      fieldId: {
        type: String,
        trim: true,
        required: true,
        unique: true,
      },
      label: [
        {
          lang: {
            type: String,
            default: 'en',
          },
          value: String,
        },
      ],
      fieldType: {
        type: String,
        trim: true,
        required: true,
        lowercase: true,
        default: 'text',
      },
      fieldDefaultValue: { type: mongoose.Schema.Types.Mixed },
      fieldOptions: { type: mongoose.Schema.Types.Mixed },
      dataOutsource: {
        refCollection: {
          type: String,
          trim: true,
        },
        refFields: {
          type: [String], // This defines an array of strings
        },
        parms: { type: mongoose.Schema.Types.Mixed },
      },
      isHiddenInCreate: {
        type: Boolean,
        default: false,
      },
      isHiddenInUpdate: {
        type: Boolean,
        default: false,
      },
      fieldOrder: {
        type: Number,
        required: true,
        default: 0,
      },
      uiParms: { type: mongoose.Schema.Types.Mixed },
    },
  ],
  dataTable: {
    dataTableParms: { type: mongoose.Schema.Types.Mixed },
    dataTableUiParms: { type: mongoose.Schema.Types.Mixed },
    collumns: [
      {
        fieldId: {
          type: String,
          trim: true,
          required: true,
          unique: true,
        },
        title: [{ lang: String, value: String }],
        cellType: {
          type: String,
          trim: true,
          required: true,
          lowercase: true,
          default: 'text',
        },
        cellParms: { type: mongoose.Schema.Types.Mixed },
        cellUiParms: { type: mongoose.Schema.Types.Mixed },
        cellOrder: {
          type: Number,
          required: true,
          default: 0,
        },
      },
    ],
  },
  schemaCollection: [
    {
      fieldId: {
        type: String,
        trim: true,
        required: true,
        unique: true,
      },
      fieldType: {
        type: String,
        trim: true,
        required: true,
        default: 'String',
      },
      refCollection: {
        type: String,
        trim: true,
      },
      isAutopopulate: {
        type: Boolean,
        default: false,
      },
      isEnabled: {
        type: Boolean,
        default: false,
      },
      isRemoved: {
        type: Boolean,
        default: false,
      },
      isRequired: {
        type: Boolean,
        default: false,
      },
      isLowercase: {
        type: Boolean,
        default: false,
      },
      isTrim: {
        type: Boolean,
        default: false,
      },
      default: {
        type: mongoose.Schema.Types.Mixed,
      },
    },
  ],
});

module.exports = mongoose.model('NoCodeCollections', noCodeCollectionsSchema);
