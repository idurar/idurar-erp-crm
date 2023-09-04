// const createCRUDController = require("./corsControllers/crudController");
// module.exports = createCRUDController("Invoice");

const mongoose = require('mongoose');
const moment = require('moment');
const Model = mongoose.model('Invoice');
const custom = require('@/controllers/middlewaresControllers/pdfController');
const sendMail = require('./mailInvoiceController');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const methods = createCRUDController('Invoice');

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
      message: 'Invoice created successfully',
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

methods.summary = async (req, res) => {
  try {
    let defaultType = 'month';

    const { type } = req.query;

    if (type) {
      if (['week', 'month', 'year'].includes(type)) {
        defaultType = type;
      } else {
        return res.status(400).json({
          success: false,
          result: null,
          message: 'Invalid type',
        });
      }
    }

    const currentDate = moment();
    let startDate = currentDate.clone().subtract(1, 'month').startOf('month');
    let endDate = currentDate.clone().subtract(1, 'month').endOf('month');

    if (defaultType === 'week') {
      startDate = currentDate.clone().subtract(1, 'week').startOf('week');
      endDate = currentDate.clone().subtract(1, 'week').endOf('week');
    }
    if (defaultType === 'year') {
      startDate = currentDate.clone().subtract(1, 'year').startOf('year');
      endDate = currentDate.clone().subtract(1, 'year').endOf('year');
    }

    const result = await Model.aggregate([
      {
        $match: {
          removed: false,
          date: {
            $gte: startDate.toDate(),
            $lte: endDate.toDate(),
          },
        },
      },
      {
        $group: {
          _id: '$status',
          count: {
            $sum: 1,
          },
          total_amount: {
            $sum: '$total',
          },
        },
      },
      {
        $group: {
          _id: null,
          total_count: {
            $sum: '$count',
          },
          results: {
            $push: '$$ROOT',
          },
        },
      },
      {
        $unwind: '$results',
      },
      {
        $project: {
          _id: 0,
          status: '$results._id',
          count: '$results.count',
          percentage: {
            $round: [{ $multiply: [{ $divide: ['$results.count', '$total_count'] }, 100] }, 1],
          },
          total_amount: '$results.total_amount',
        },
      },
      {
        $sort: {
          status: 1,
        },
      },
    ]);

    const unpaid = await Model.aggregate([
      {
        $match: {
          removed: false,
          date: {
            $gte: startDate.toDate(),
            $lte: endDate.toDate(),
          },
          paymentStatus: 'unpaid',
        },
      },
      {
        $group: {
          _id: null,
          total_amount: {
            $sum: '$total',
          },
        },
      },
      {
        $project: {
          _id: 0,
          total_amount: '$total_amount',
        },
      },
    ]);

    const finalResult = {
      total: result.reduce((acc, item) => acc + item.total_amount, 0).toFixed(2),
      total_undue: unpaid.length > 0 ? unpaid[0].total_amount.toFixed(2) : 0,
      type,
      performance: result,
    };

    return res.status(200).json({
      success: true,
      result: finalResult,
      message: `Successfully found all invoices for the last ${defaultType}`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Oops there is an Error',
      error: error,
    });
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

methods.sendMail = sendMail;
module.exports = methods;
