const mongoose = require('mongoose');
const Model = mongoose.model('Offer');
const moment = require('moment');
const custom = require('@/controllers/middlewaresControllers/pdfController');

const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const methods = createCRUDController('Offer');

delete methods['create'];
delete methods['update'];

methods.create = async (req, res) => {
  try {
    const { items = [], taxRate = 0, discount = 0 } = req.body;

    // default
    let subOfferTotal = 0;
    let subTotal = 0;
    let taxTotal = 0;
    let offerTotal = 0;
    let total = 0;

    //Calculate the items array with subTotal, total, taxTotal
    items.map((item) => {
      let itemTotal = item['quantity'] * item['price'];
      let itemOfferTotal = item['quantity'] * item['offerPrice'];
      //sub total
      subTotal += itemTotal;
      subOfferTotal += itemOfferTotal;
      //price total
      item['total'] = itemTotal;
      item['offerTotal'] = itemOfferTotal;
    });

    taxTotal = subTotal * taxRate;
    total = subTotal + taxTotal;
    offerTotal = subOfferTotal + taxTotal;

    let body = req.body;

    body['subTotal'] = subTotal;
    body['subOfferTotal'] = subOfferTotal;
    body['taxTotal'] = taxTotal;
    body['total'] = total;
    body['offerTotal'] = offerTotal;
    body['items'] = items;

    // Creating a new document in the collection
    const result = await new Model(body).save();
    const fileId = 'offer-' + result._id + '.pdf';
    const updateResult = await Model.findOneAndUpdate(
      { _id: result._id },
      { pdfPath: fileId },
      {
        new: true,
      }
    ).exec();
    // Returning successfull response

    custom.generatePdf('Offer', { filename: 'offer', format: 'A4' }, result);

    // Returning successfull response
    return res.status(200).json({
      success: true,
      result: updateResult,
      message: 'Offer created successfully',
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
    let subOfferTotal = 0;
    let subTotal = 0;
    let taxTotal = 0;
    let offerTotal = 0;
    let total = 0;
    // let credit = 0;

    //Calculate the items array with subTotal, total, taxTotal
    items.map((item) => {
      let itemTotal = item['quantity'] * item['price'];
      let itemOfferTotal = item['quantity'] * item['offerPrice'];
      //sub total
      subTotal += itemTotal;
      subOfferTotal += itemOfferTotal;
      //price total
      item['total'] = itemTotal;
      item['offerTotal'] = itemOfferTotal;
    });
    taxTotal = subTotal * taxRate;
    total = subTotal + taxTotal;
    offerTotal = subOfferTotal + taxTotal;

    let body = req.body;

    body['subTotal'] = subTotal;
    body['subOfferTotal'] = subOfferTotal;
    body['taxTotal'] = taxTotal;
    body['total'] = total;
    body['offerTotal'] = offerTotal;
    body['items'] = items;
    body['pdfPath'] = 'offer-' + req.params.id + '.pdf';
    // Find document by id and updates with the required fields

    const result = await Model.findOneAndUpdate({ _id: req.params.id, removed: false }, body, {
      new: true, // return the new result instead of the old one
    }).exec();

    // Returning successfull response

    custom.generatePdf('Offer', { filename: 'offer', format: 'A4' }, result);
    return res.status(200).json({
      success: true,
      result,
      message: 'we update this offer by this id: ' + req.params.id,
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

    const statuses = ['draft', 'pending', 'sent', 'expired', 'declined', 'accepted'];

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
            $round: [{ $multiply: [{ $divide: ['$results.count', '$total_count'] }, 100] }, 0],
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

    statuses.forEach((status) => {
      const found = result.find((item) => item.status === status);
      if (!found) {
        result.push({
          status,
          count: 0,
          percentage: 0,
          total_amount: 0,
        });
      }
    });

    const total = result.reduce((acc, item) => acc + item.total_amount, 0).toFixed(2);

    const finalResult = {
      total,
      type: defaultType,
      performance: result,
    };

    return res.status(200).json({
      success: true,
      result: finalResult,
      message: `Successfully found all Offers for the last ${defaultType}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Oops there is an Error',
      error: error,
    });
  }
};

module.exports = methods;
