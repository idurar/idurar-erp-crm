// const crudController = require("./corsControllers/crudController");
// module.exports = crudController.createCRUDController("Quote");

const mongoose = require('mongoose');
const moment = require('moment');

const Model = mongoose.model('Quote');
const InvoiceModel = mongoose.model('Invoice');

const custom = require('../corsControllers/custom');
const sendMail = require('./mailQuoteController');

const crudController = require('../corsControllers/crudController');
const methods = crudController.createCRUDController('Quote');

delete methods['create'];
delete methods['update'];

methods.create = async (req, res) => {
  try {
    const { items = [], taxRate = 0, discount = 0 } = req.body;

    // default
    let subTotal = 0;
    let taxTotal = 0;
    let total = 0;
    // let credit = 0;

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

    custom.generatePdf('Quote', { filename: 'quote', format: 'A4' }, result);

    // Returning successfull response
    return res.status(200).json({
      success: true,
      result: updateResult,
      message: 'Quote created successfully',
    });
  } catch (err) {
    // If err is thrown by Mongoose due to required validations
    if (err.name == 'ValidationError') {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Required fields are not supplied',
      });
    } else {
      // Server Error
      return res.status(500).json({
        success: false,
        result: null,
        message: 'Oops there is an Error',
      });
    }
  }
};

methods.update = async (req, res) => {
  try {
    const { items = [], taxRate = 0, discount = 0 } = req.body;

    // default
    let subTotal = 0;
    let taxTotal = 0;
    let total = 0;
    // let credit = 0;

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
    body['pdfPath'] = 'quote-' + req.params.id + '.pdf';
    // Find document by id and updates with the required fields

    const result = await Model.findOneAndUpdate({ _id: req.params.id, removed: false }, body, {
      new: true, // return the new result instead of the old one
    }).exec();

    // Returning successfull response

    custom.generatePdf('Quote', { filename: 'invoice', format: 'A4' }, result);
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
        message: 'Required fields are not supplied',
      });
    } else {
      // Server Error
      return res.status(500).json({
        success: false,
        result: null,
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

    const total = result.reduce((acc, item) => acc + item.total_amount, 0).toFixed(2);

    const finalResult = {
      total,
      type: defaultType,
      performance: result,
    };

    return res.status(200).json({
      success: true,
      result: finalResult,
      message: `Successfully found all Quotations for the last ${defaultType}`,
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

methods.convertQuoteToInvoice = async (req, res) => {
  try {
    const quoteId = req.params.id; // Assuming the quote ID is passed in the URL

    // Fetch the quote from the database
    const quote = await Model.findById(quoteId);
    if (!quote) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Quote not found',
      });
    }

    // If the quote is already converted, prevent creating another invoice
    if (quote.converted) {
      return res.status(409).json({
        success: false,
        result: null,
        message: 'Quote is already converted to an invoice.',
      });
    }

    // Convert the quote details to invoice details
    const invoiceData = {
      number: quote.number,
      year: quote.year,
      date: moment(),
      expiredDate: moment().add(1, 'month'),
      client: quote.client,
      items: quote.items.map((item) => ({
        itemName: item.itemName,
        description: item.description,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      })),
      taxRate: quote.taxRate,
      subTotal: quote.subTotal,
      taxTotal: quote.taxTotal,
      total: quote.total,
      credit: quote.credit,
      discount: quote.discount,
      note: quote.note,
    };

    // Create the invoice document
    const invoice = await new InvoiceModel(invoiceData).save();

    // Mark the quote as converted
    quote.converted = true;
    await quote.save();

    // Return the created invoice
    return res.status(200).json({
      success: true,
      result: quote,
      message: 'Successfully converted quote to invoice',
    });
  } catch (err) {
    // If error is because of Invalid ObjectId
    if (err.kind == 'ObjectId') {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Invalid ID format',
      });
    } else {
      return res.status(500).json({
        success: false,
        result: null,
        message: 'Oops there is an Errorr',
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
//       "Quote",
//       { filename: "Quote report", format: "A5" },
//       result,
//       function (callback) {
//         if (callback.hasOwnProperty("success") && callback.success) {
//           let { data } = callback;

//           // Returning successfull response
//           res.status(200).json({
//             success: true,
//             data: data,
//             message: "Successfully updated the Quote in Model",
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
