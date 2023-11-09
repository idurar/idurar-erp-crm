const mongoose = require('mongoose');
const moment = require('moment');

const Model = mongoose.model('Payment');

const summary = async (req, res) => {
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

    // get total amount of invoices
    const result = await Model.aggregate([
      {
        $match: {
          removed: false,
          // date: {
          //   $gte: startDate.toDate(),
          //   $lte: endDate.toDate(),
          // },
        },
      },
      {
        $group: {
          _id: null, // Group all documents into a single group
          count: {
            $sum: 1,
          },
          total: {
            $sum: '$amount',
          },
        },
      },
      {
        $project: {
          _id: 0, // Exclude _id from the result
          count: 1,
          total: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      result: result.length > 0 ? result[0] : { count: 0, total: 0 },
      message: `Successfully fetched the summary of payment invoices for the last ${defaultType}`,
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
      error: error,
    });
  }
};

module.exports = summary;
