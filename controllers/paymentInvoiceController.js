const mongoose = require("mongoose");
const Model = mongoose.model("PaymentInvoice");
const Invoice = mongoose.model("Invoice");
const custom = require("./helpersControllers/custom");

const crudController = require("./helpersControllers/crudController");
const methods = crudController.createCRUDController("PaymentInvoice");

delete methods["create"];
delete methods["update"];

methods.create = async (req, res) => {
  try {
    // Creating a new document in the collection
    if (req.body.amount === 0) {
      return res.status(202).json({
        success: false,
        result: null,
        message: `The Minimum Amount couldn't be 0`,
      });
    }

    const currentInvoice = await Invoice.findOne({
      _id: req.body.invoice,
      removed: false,
    });

    const {
      total: previousTotal,
      discount: previousDiscount,
      credit: previousCredit,
    } = currentInvoice;

    const maxAmount = previousTotal - previousDiscount - previousCredit;

    if (req.body.amount > maxAmount) {
      return res.status(202).json({
        success: false,
        result: null,
        message: `The Max Amount you can add is ${maxAmount}`,
      });
    }

    const result = await new Model(req.body).save();

    const fileId = "payment-invoice-report-" + result._id + ".pdf";
    const updatePath = Model.findOneAndUpdate(
      { _id: result._id },
      { pdfPath: fileId },
      {
        new: true,
      }
    ).exec();
    // Returning successfull response

    const { _id: paymentInvoiceId, amount } = result;
    const { id: invoiceId, total, discount, credit } = result.invoice;

    let paymentStatus =
      total - discount === credit + amount
        ? "paid"
        : credit + amount > 0
        ? "partially"
        : "unpaid";

    const invoiceUpdate = Invoice.findByIdAndUpdate(
      { _id: invoiceId },
      {
        $push: { paymentInvoice: paymentInvoiceId },
        $inc: { credit: amount },
        $set: { paymentStatus: paymentStatus },
      }
    ).exec();

    // custom.generatePdf(
    //   "PaymentInvoice",
    //   { filename: "payment-invoice-report", format: "A5" },
    //   result
    // );

    const [updatedResult, invoiceUpdated] = await Promise.all([
      updatePath,
      invoiceUpdate,
    ]);
    res.status(200).json({
      success: true,
      result: updatedResult,
      message: "Successfully Created the document in Model ",
    });
  } catch (err) {
    console.log(err);
    // If err is thrown by Mongoose due to required validations
    if (err.name == "ValidationError") {
      res.status(400).json({
        success: false,
        result: null,
        message: "Required fields are not supplied",
        error: err,
      });
    } else {
      // Server Error
      res.status(500).json({
        success: false,
        result: null,
        message: "Oops there is an Error",
        error: err,
      });
    }
  }
};

methods.update = async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.amount === 0) {
      return res.status(202).json({
        success: false,
        result: null,
        message: `The Minimum Amount couldn't be 0`,
      });
    }
    // Find document by id and updates with the required fields
    const previousPayment = await Model.findOne({
      _id: req.params.id,
      removed: false,
    });

    const { amount: previousAmount } = previousPayment;
    const {
      id: invoiceId,
      total,
      discount,
      credit: previousCredit,
    } = previousPayment.invoice;

    const { amount: currentAmount } = req.body;

    const changedAmount = currentAmount - previousAmount;
    const maxAmount = total - discount - previousCredit - changedAmount;

    if (currentAmount > maxAmount) {
      return res.status(202).json({
        success: false,
        result: null,
        message: `The Max Amount you can add is ${maxAmount}`,
      });
    }

    let paymentStatus =
      total - discount === previousCredit + changedAmount
        ? "paid"
        : previousCredit + changedAmount > 0
        ? "partially"
        : "unpaid";

    const updatedDate = new Date();
    const updates = {
      number: req.body.number,
      date: req.body.date,
      amount: req.body.amount,
      paymentMode: req.body.paymentMode,
      ref: req.body.ref,
      description: req.body.description,
      updated: updatedDate,
    };

    const updatePayment = Model.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          updates,
        },
      }
    ).exec();

    const updateInvoice = Invoice.findByIdAndUpdate(
      { _id: invoiceId },
      {
        $inc: { credit: changedAmount },
        $set: {
          paymentStatus: paymentStatus,
        },
      }
    ).exec();

    const [result, invoiceUpdated] = await Promise.all([
      updatePayment,
      updateInvoice,
    ]);
    // custom.generatePdf(
    //   "PaymentInvoice",
    //   { filename: "payment-invoice-report", format: "A5" },
    //   result
    // );

    res.status(200).json({
      success: true,
      result,
      message: "Successfully updated the document in Model ",
    });
  } catch (err) {
    console.log(err);
    // If err is thrown by Mongoose due to required validations
    if (err.name == "ValidationError") {
      res.status(400).json({
        success: false,
        result: null,
        message: "Required fields are not supplied",
        error: err,
      });
    } else {
      // Server Error
      res.status(500).json({
        success: false,
        result: null,
        message: "Oops there is an Error",
        error: err,
      });
    }
  }
};

module.exports = methods;
