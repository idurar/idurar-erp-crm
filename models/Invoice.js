const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const invoiceSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  number: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  recurring: {
    type: String,
    default: "0",
  },
  date: {
    type: Date,
    required: true,
  },
  expiredDate: {
    type: Date,
    required: true,
  },
  client: {
    type: mongoose.Schema.ObjectId,
    ref: "Client",
    required: true,
    autopopulate: true,
  },
  items: [
    {
      itemName: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
    },
  ],
  currency: {
    type: mongoose.Schema.ObjectId,
    ref: "Currency",
    autopopulate: true,
  },
  taxRate: {
    type: Number,
    default: 0,
  },
  subTotal: {
    type: Number,
    default: 0,
  },
  taxTotal: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    default: 0,
  },
  credit: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  clientPayment: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "ClientPayment",
    },
  ],
  paymentStatus: {
    type: String,
    default: "unpaid",
  },
  note: {
    type: String,
  },
  status: {
    type: String,
    default: "draft",
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  pdfPath: {
    type: String,
    default: "",
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

invoiceSchema.plugin(require("mongoose-autopopulate"));
module.exports = mongoose.model("Invoice", invoiceSchema);
