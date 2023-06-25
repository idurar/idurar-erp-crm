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

  pageUiParms: { type: mongoose.Schema.Types.Mixed },

  dataTableUiParms: { type: mongoose.Schema.Types.Mixed },
  formUiParms: { type: mongoose.Schema.Types.Mixed },
  removeUiParms: { type: mongoose.Schema.Types.Mixed },
  readUiParms: { type: mongoose.Schema.Types.Mixed },
  createUiParms: { type: mongoose.Schema.Types.Mixed },
  updateUiParms: { type: mongoose.Schema.Types.Mixed },

  readController: { type: mongoose.Schema.Types.Mixed },
  updateController: { type: mongoose.Schema.Types.Mixed },
  searchController: { type: mongoose.Schema.Types.Mixed },
  filterController: { type: mongoose.Schema.Types.Mixed },
  createController: { type: mongoose.Schema.Types.Mixed },
  removeController: { type: mongoose.Schema.Types.Mixed },
  listController: { type: mongoose.Schema.Types.Mixed },

  collectionParms: {
    searchConfig: {
      displayLabels: [String],
      searchFields: String,
      outputValue: {
        type: String,
        default: '_id',
      },
    },
    entityDisplayLabels: [String],
  },

  collectionLabels: [
    {
      lang: { type: String, default: 'en' },
      labels: {
        PANEL_TITLE: String,
        ENTITY_NAME: String,
        CREATE_ENTITY: String,
        ADD_NEW_ENTITY: String,
        UPDATE_ENTITY: String,
        DATATABLE_TITLE: String,
      },
    },
  ],
  collectionSchema: [
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
        default: 'String',
      },
      refCollection: {
        type: String,
        trim: true,
      },
      refFields: {
        type: [String], // This defines an array of strings
      },
      isAutopopulate: {
        type: Boolean,
        default: false,
      },
      isAutoManaged: {
        create: {
          type: Boolean,
          default: false,
        },
        update: {
          type: Boolean,
          default: false,
        },
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
      formField: {
        fieldType: {
          type: String,
          trim: true,
          required: true,
          lowercase: true,
          default: 'text',
        },
        fieldDefaultValue: { type: mongoose.Schema.Types.Mixed },
        fieldOptions: { type: mongoose.Schema.Types.Mixed },
        isEnabledInCreate: {
          type: Boolean,
          default: true,
        },
        isEnabledInUpdate: {
          type: Boolean,
          default: true,
        },
        fieldOrder: {
          type: Number,
          required: true,
          default: 0,
        },
        uiParms: { type: mongoose.Schema.Types.Mixed },
      },
      dataTable: {
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
        isHidden: {
          type: Boolean,
          default: false,
        },
      },
      readBox: {
        lineType: {
          type: String,
          trim: true,
          required: true,
          lowercase: true,
          default: 'text',
        },
        lineParms: { type: mongoose.Schema.Types.Mixed },
        lineUiParms: { type: mongoose.Schema.Types.Mixed },
        lineOrder: {
          type: Number,
          required: true,
          default: 0,
        },
        isHidden: {
          type: Boolean,
          default: false,
        },
      },
    },
  ],
});

module.exports = mongoose.model('NoCodeCollections', noCodeCollectionsSchema);
