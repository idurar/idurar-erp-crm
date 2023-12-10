const mongoose = require('mongoose');

const AppTableStructureSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin', required: true },
  tableName: {
    type: String,
    required: true,
    lowercase: true,
  },
  tableLanguage: {
    type: String,
    default: 'en_us',
  },
  title: String,
  description: {
    type: String,
    required: true,
  },
  tags: [String],
  icon: {
    type: String,
  },
  headerImage: {
    type: String,
  },
  category: String,
  type: String,
  ref: String,
  prefix: String,
  statusTypes: {
    type: Array,
    default: ['new', 'active', 'unactive', 'draft', 'sent'],
  },
  progressStatusTypes: {
    type: Array,
    default: ['not started', 'in progress', 'paused', 'done'],
  },
  finalStatus: {
    type: Array,
    default: ['delivred', 'cancelled', 'pending'],
  },

  invoice: { maxCount: Number, multiple: Boolean, label: String },
  quote: { maxCount: Number, multiple: Boolean, label: String },
  offer: { maxCount: Number, multiple: Boolean, label: String },
  client: { maxCount: Number, multiple: Boolean, label: String },
  lead: { maxCount: Number, multiple: Boolean, label: String },
  company: { maxCount: Number, multiple: Boolean, label: String },
  people: { maxCount: Number, multiple: Boolean, label: String },
  product: { maxCount: Number, multiple: Boolean, label: String },
  order: { maxCount: Number, multiple: Boolean, label: String },
  expense: { maxCount: Number, multiple: Boolean, label: String },
  employee: { maxCount: Number, multiple: Boolean, label: String },
  salary: { maxCount: Number, multiple: Boolean, label: String },
  payment: { maxCount: Number, multiple: Boolean, label: String },
  supplier: { maxCount: Number, multiple: Boolean, label: String },
  purchase: { maxCount: Number, multiple: Boolean, label: String },
  shipment: { maxCount: Number, multiple: Boolean, label: String },

  invoiceFieldList: [{ fieldName: [String], label: String, Color: String }],
  quoteFieldList: [{ fieldName: [String], label: String, Color: String }],
  offerFieldList: [{ fieldName: [String], label: String, Color: String }],
  clientFieldList: [{ fieldName: [String], label: String, Color: String }],
  leadFieldList: [{ fieldName: [String], label: String, Color: String }],
  companyFieldList: [{ fieldName: [String], label: String, Color: String }],
  peopleFieldList: [{ fieldName: [String], label: String, Color: String }],
  productFieldList: [{ fieldName: [String], label: String, Color: String }],
  orderFieldList: [{ fieldName: [String], label: String, Color: String }],
  expenseFieldList: [{ fieldName: [String], label: String, Color: String }],
  employeeFieldList: [{ fieldName: [String], label: String, Color: String }],
  salaryFieldList: [{ fieldName: [String], label: String, Color: String }],
  paymentFieldList: [{ fieldName: [String], label: String, Color: String }],
  supplierFieldList: [{ fieldName: [String], label: String, Color: String }],
  purchaseFieldList: [{ fieldName: [String], label: String, Color: String }],
  shipmentFieldList: [{ fieldName: [String], label: String, Color: String }],
  field: [
    {
      fieldName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
      fieldType: {
        type: String,
        default: 'string',
        lowercase: true,
        required: true,
      },
      color: String,
      options: [
        {
          label: String,
          color: String,
          value: {
            type: String,
            trim: true,
            lowercase: true,
          },
        },
      ],
      label: {
        type: String,
        required: true,
      },
      defaultValue: {},
      hasAppTableSource: {
        type: Boolean,
        default: false,
      },
      appTableSourceValue: {
        tableName: {
          type: String,
          trim: true,
          lowercase: true,
        },
        tableFieldName: {
          type: String,
          trim: true,
          lowercase: true,
        },
      },
      isAutoCalculated: {
        type: Boolean,
        default: false,
      },
      calculatedMethod: {
        method: {},
        // this is example of method:  {
        //   operation: "multiply",
        //   fields: [
        //     {
        //       operation: "sum",
        //       fields: [{fieldObject}, {fieldObject}]
        //     },
        //     {
        //       appTableRow: { type: mongoose.Schema.ObjectId, ref: 'AppTable' },
        //       fieldNameCol: {
        //         type: String,
        //         trim: true,
        //         lowercase: true,
        //       },
        //     }
        //   ]
        // };
        isMathCalculation: Boolean,
        isArrayCombination: Boolean,
        isTextCombination: Boolean,
        isValid: Boolean,
      },
      hasExtrnalSource: {
        type: Boolean,
        default: false,
      },
      extrnalSourceValue: {
        modelName: {
          type: String,
          trim: true,
          lowercase: true,
        },
        modelFieldName: {
          type: String,
          trim: true,
          lowercase: true,
        },
      },
      isAutoPopulate: {
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
      isUnique: {
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
      isLocked: {
        type: Boolean,
        default: true,
      },
    },
  ],
  language: {
    type: String,
    default: 'en_us',
  },
  created: {
    type: String,
    required: true,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  isLocked: {
    type: Boolean,
    default: true,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  hasPublicForm: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('AppTableStructure', AppTableStructureSchema);
