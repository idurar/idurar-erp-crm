// const crudController = require("./corsControllers/crudController");
// module.exports = crudController.createCRUDController("Invoice");

const mongoose = require('mongoose');
const Model = mongoose.model('Invoice');
const custom = require('../corsControllers/custom');

const crudController = require('../corsControllers/crudController');
const methods = crudController.createCRUDController('Invoice');

delete methods['create'];
delete methods['update'];

methods.create = async (req, res) => {
  try {
    const { items = [], taxRate = 0, discount = 0 } = req.body;

    // default
    let subTotal = 0;
    let taxTotal = 0;
    let total = 0;

    //Calculate the items array with subTotal, total, taxTotal
    items.map((item) => {
      let total = item['quantity'] * item['price'];
      //sub total
      subTotal += total;
      //item total
      item['total'] = total;
    });
    taxTotal = subTotal * taxRate;
    total = subTotal + taxTotal;

    let body = req.body;

    body['subTotal'] = subTotal;
    body['taxTotal'] = taxTotal;
    body['total'] = total;
    body['items'] = items;

    let paymentStatus = total - discount === 0 ? 'paid' : 'unpaid';

    body['paymentStatus'] = paymentStatus;
    // Creating a new document in the collection
    const result = await new Model(body).save();
    const fileId = 'invoice-' + result._id + '.pdf';
    const updateResult = await Model.findOneAndUpdate(
      { _id: result._id },
      { pdfPath: fileId },
      {
        new: true,
      }
    ).exec();
    // Returning successfull response

    custom.generatePdf('Invoice', { filename: 'invoice', format: 'A4' }, result);

    // Returning successfull response
    return res.status(200).json({
      success: true,
      result: updateResult,
      message: 'Successfully Created the document in Model ',
    });
  } catch (err) {
    // If err is thrown by Mongoose due to required validations
    if (err.name == 'ValidationError') {
      return res.status(400).json({
        success: false,
        result: null,
        error: err,
        message: 'Required fields are not supplied',
      });
    } else {
      // Server Error
      return res.status(500).json({
        success: false,
        result: null,
        error: err,
        message: 'Oops there is an Error',
      });
    }
  }
};

methods.update = async (req, res) => {
  try {
    const previousInvoice = await Model.findOne({
      _id: req.params.id,
      removed: false,
    });

    const { credit } = previousInvoice;

    const { items = [], taxRate = 0, discount = 0 } = req.body;

    // default
    let subTotal = 0;
    let taxTotal = 0;
    let total = 0;

    //Calculate the items array with subTotal, total, taxTotal
    items.map((item) => {
      let total = item['quantity'] * item['price'];
      //sub total
      subTotal += total;
      //item total
      item['total'] = total;
    });
    taxTotal = subTotal * taxRate;
    total = subTotal + taxTotal;

    let body = req.body;

    body['subTotal'] = subTotal;
    body['taxTotal'] = taxTotal;
    body['total'] = total;
    body['items'] = items;
    body['pdfPath'] = 'invoice-' + req.params.id + '.pdf';
    // Find document by id and updates with the required fields

    let paymentStatus = total - discount === credit ? 'paid' : credit > 0 ? 'partially' : 'unpaid';
    body['paymentStatus'] = paymentStatus;

    const result = await Model.findOneAndUpdate({ _id: req.params.id, removed: false }, body, {
      new: true, // return the new result instead of the old one
    }).exec();

    // Returning successfull response

    custom.generatePdf('Invoice', { filename: 'invoice', format: 'A4' }, result);
    return res.status(200).json({
      success: true,
      result,
      message: 'we update this document by this id: ' + req.params.id,
    });
  } catch (err) {
    // If err is thrown by Mongoose due to required validations
    console.log(err);
    if (err.name == 'ValidationError') {
      return res.status(400).json({
        success: false,
        result: null,
        error: err,
        message: 'Required fields are not supplied',
      });
    } else {
      // Server Error
      return res.status(500).json({
        success: false,
        result: null,
        error: err,
        message: 'Oops there is an Error',
      });
    }
  }
};

// methods.update = async (req, res) => {
//   try {
//     const { id } = req.params;
//     var { items = [], taxRate = 0, discount = 0 } = req.body;

//     // default
//     var subTotal = 0;
//     var taxTotal = 0;
//     var total = 0;
//     var credit = 0;

//     //Calculate the items array with subTotal, total, taxTotal
//     items = items.map((item) => {
//       let total = item["quantity"] * item["price"];
//       //sub total
//       subTotal += total;
//       //item total
//       item["total"] = total;
//       return item;
//     });

//     taxTotal = subTotal * taxRate;
//     total = subTotal + taxTotal;

//     let body = req.body;

//     body["subTotal"] = subTotal;
//     body["taxTotal"] = taxTotal;
//     body["total"] = total;

//     //Calculate credited amount
//     const findById = await Model.findById(id).populate("paymentInvoice");
//     if (findById["paymentInvoice"].length > 0) {
//       findById["paymentInvoice"].map((payment) => {
//         credit += payment.amount;
//       });
//     }

//     body["credit"] = credit;

//     //Calculate payment status
//     if (total - discount - credit <= 0) {
//       body["paymentStatus"] = "paid";
//     }
//     // Find document by id and updates with the required fields
//     const result = await Model.findOneAndUpdate({ _id: id }, body, {
//       new: true,
//     })
//       .populate("client")
//       .exec();

//     await custom.generatePdf(
//       "Invoice",
//       { filename: "Invoice report", format: "A5" },
//       result,
//       function (callback) {
//         if (callback.hasOwnProperty("success") && callback.success) {
//           let { data } = callback;

//           // Returning successfull response
//           res.status(200).json({
//             success: true,
//             data: data,
//             message: "Successfully updated the Invoice in Model",
//           });
//         } else {
//           // Server Error
//           return res.status(500).json({
//             success: false,
//             result: null,
//             message: "Oops there is an Error",
//           });
//         }
//       }
//     );
//   } catch (err) {
//     // If err is thrown by Mongoose due to required validations send error message
//     if (err.name == "ValidationError") {
//       return res.status(400).json({
//         success: false,
//         result: null,
//         message: "Required fields are not supplied",
//       });
//     } else {
//       // Server Error
//       return res.status(500).json({
//         success: false,
//         result: null,
//         message: "Oops there is an Error",
//       });
//     }
//   }
// };

module.exports = methods;
