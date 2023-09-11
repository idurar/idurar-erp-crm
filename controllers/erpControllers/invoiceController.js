// const createCRUDController = require("./corsControllers/crudController");
// module.exports = createCRUDController("Invoice");

const mongoose = require('mongoose');
const moment = require('moment');
const Model = mongoose.model('Invoice');
const custom = require('@/controllers/middlewaresControllers/pdfController');
const sendMail = require('./mailInvoiceController');

const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const methods = createCRUDController('Invoice');
const { calculate } = require('@/helpers');

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
      let total = calculate.multiply(item['quantity'], item['price']);
      //sub total
      subTotal = calculate.add(subTotal, total);
      //item total
      item['total'] = total;
    });
    taxTotal = calculate.multiply(subTotal, taxRate);
    total = calculate.add(subTotal, taxTotal);

    let body = req.body;

    body['subTotal'] = subTotal;
    body['taxTotal'] = taxTotal;
    body['total'] = total;
    body['items'] = items;

    let paymentStatus = calculate.sub(total, discount) === 0 ? 'paid' : 'unpaid';

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

    if (items.length === 0) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Items cannot be empty',
      });
    }

    // default
    let subTotal = 0;
    let taxTotal = 0;
    let total = 0;

    //Calculate the items array with subTotal, total, taxTotal
    items.map((item) => {
      let total = calculate.multiply(item['quantity'], item['price']);
      //sub total
      subTotal = calculate.add(subTotal, total);
      //item total
      item['total'] = total;
    });
    taxTotal = calculate.multiply(subTotal, taxRate);
    total = calculate.add(subTotal, taxTotal);

    let body = req.body;

    body['subTotal'] = subTotal;
    body['taxTotal'] = taxTotal;
    body['total'] = total;
    body['items'] = items;
    body['pdfPath'] = 'invoice-' + req.params.id + '.pdf';
    // Find document by id and updates with the required fields

    let paymentStatus =
      calculate.sub(total, discount) === credit ? 'paid' : credit > 0 ? 'partially' : 'unpaid';
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
    let startDate = currentDate.clone().startOf(defaultType);
    let endDate = currentDate.clone().endOf(defaultType);

    const statuses = ['draft', 'pending', 'overdue', 'paid', 'unpaid', 'partially'];

    const response = await Model.aggregate([
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
        $facet: {
          totalInvoice: [
            {
              $group: {
                _id: null,
                total: {
                  $sum: '$total',
                },
                count: {
                  $sum: 1,
                },
              },
            },
            {
              $project: {
                _id: 0,
                total: '$total',
                count: '$count',
              },
            },
          ],
          statusCounts: [
            {
              $group: {
                _id: '$status',
                count: {
                  $sum: 1,
                },
              },
            },
            {
              $project: {
                _id: 0,
                status: '$_id',
                count: '$count',
              },
            },
          ],
          paymentStatusCounts: [
            {
              $group: {
                _id: '$paymentStatus',
                count: {
                  $sum: 1,
                },
              },
            },
            {
              $project: {
                _id: 0,
                status: '$_id',
                count: '$count',
              },
            },
          ],
          overdueCounts: [
            {
              $match: {
                expiredDate: {
                  $lt: new Date(),
                },
              },
            },
            {
              $group: {
                _id: '$status',
                count: {
                  $sum: 1,
                },
              },
            },
            {
              $project: {
                _id: 0,
                status: '$_id',
                count: '$count',
              },
            },
          ],
        },
      },
    ]);

    let result = [];

    const totalInvoices = response[0].totalInvoice ? response[0].totalInvoice[0] : 0;
    const statusResult = response[0].statusCounts || [];
    const paymentStatusResult = response[0].paymentStatusCounts || [];
    const overdueResult = response[0].overdueCounts || [];

    const statusResultMap = statusResult.map((item) => {
      return {
        ...item,
        percentage: Math.round((item.count / totalInvoices.count) * 100),
      };
    });

    const paymentStatusResultMap = paymentStatusResult.map((item) => {
      return {
        ...item,
        percentage: Math.round((item.count / totalInvoices.count) * 100),
      };
    });

    const overdueResultMap = overdueResult.map((item) => {
      return {
        ...item,
        status: 'overdue',
        percentage: Math.round((item.count / totalInvoices.count) * 100),
      };
    });

    statuses.forEach((status) => {
      const found = [...paymentStatusResultMap, ...statusResultMap, ...overdueResultMap].find(
        (item) => item.status === status
      );
      if (found) {
        result.push(found);
      }
    });

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
      total: totalInvoices.total.toFixed(2),
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
    console.log(error)
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
