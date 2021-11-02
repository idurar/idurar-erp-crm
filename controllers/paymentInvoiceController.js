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
      total - discount - (credit + amount) > 0 ? "partially" : "unpaid";
    paymentStatus = credit + amount == total ? "paid" : paymentStatus;

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
    // Find document by id and updates with the required fields
    const result = await Model.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    }).exec();
    const fileId = "payment-invoice-report-" + result._id + ".pdf";
    const updatedResult = await Model.findOneAndUpdate(
      { _id: result._id },
      { pdfPath: fileId },
      {
        new: true,
      }
    ).exec();
    // Returning successfull response

    // custom.generatePdf(
    //   "PaymentInvoice",
    //   { filename: "payment-invoice-report", format: "A5" },
    //   result
    // );

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
