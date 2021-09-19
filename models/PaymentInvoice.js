const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
mongoose.Promise = global.Promise;

const paymentInvoiceSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  number: {
    type: Number,
    required: true,
  },
  client: {
    type: mongoose.Schema.ObjectId,
    ref: "Client",
    autopopulate: true,
    required: true,
  },
  invoice: {
    type: mongoose.Schema.ObjectId,
    ref: "Invoice",
    autopopulate: true,
  },
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentMode: {
    type: mongoose.Schema.ObjectId,
    ref: "PaymentMode",
    autopopulate: true,
  },
  ref: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});
paymentInvoiceSchema.plugin(require("mongoose-autopopulate"));
paymentInvoiceSchema.plugin(AutoIncrement, { inc_field: "number" });
module.exports = mongoose.model("PaymentInvoice", paymentInvoiceSchema);
