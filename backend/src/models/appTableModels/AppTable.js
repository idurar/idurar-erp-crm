const mongoose = require('mongoose');

const AppTableSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  tableName: { type: mongoose.Schema.ObjectId, ref: 'AppTableStructure', required: true },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin', required: true },
  owner: { type: mongoose.Schema.ObjectId, ref: 'Admin', required: true },
  assigned: { type: mongoose.Schema.ObjectId, ref: 'Employee', required: true },

  invoiceList: [{ type: mongoose.Schema.ObjectId, ref: 'Invoice' }],
  quoteList: [{ type: mongoose.Schema.ObjectId, ref: 'Quote' }],
  offerList: [{ type: mongoose.Schema.ObjectId, ref: 'Offer' }],
  clientList: [{ type: mongoose.Schema.ObjectId, ref: 'Client' }],
  leadList: [{ type: mongoose.Schema.ObjectId, ref: 'lead' }],
  companyList: [{ type: mongoose.Schema.ObjectId, ref: 'Company' }],
  peopleList: [{ type: mongoose.Schema.ObjectId, ref: 'People' }],
  productList: [{ type: mongoose.Schema.ObjectId, ref: 'Product' }],
  orderList: [{ type: mongoose.Schema.ObjectId, ref: 'Order' }],
  expenseList: [{ type: mongoose.Schema.ObjectId, ref: 'Expense' }],
  employeeList: [{ type: mongoose.Schema.ObjectId, ref: 'Employee' }],
  salaryList: [{ type: mongoose.Schema.ObjectId, ref: 'Salary' }],
  paymentList: [{ type: mongoose.Schema.ObjectId, ref: 'Payment' }],
  supplierList: [{ type: mongoose.Schema.ObjectId, ref: 'Supplier' }],
  purchaseList: [{ type: mongoose.Schema.ObjectId, ref: 'Purchase' }],
  shipmentList: [{ type: mongoose.Schema.ObjectId, ref: 'Shipment' }],

  field: [
    {
      fieldName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
      fieldValue: {},
    },
  ],
  icon: {
    type: String,
  },
  headerImage: {
    type: String,
  },
  language: {
    type: String,
    default: 'en_us',
  },
  title: String,
  description: {
    type: String,
    required: true,
  },
  content: String,
  tags: [String],
  image: String,
  imagesList: [String],
  file: String,
  fileList: [String],
  status: String,
  progressStatus: String,
  finalStatus: String,
  category: String,
  type: String,
  ref: String,
  number: Number,
  year: Number,
  recurring: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'annually', 'quarter'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  expiredDate: Date,
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
});

module.exports = mongoose.model('AppTable', AppTableSchema);
