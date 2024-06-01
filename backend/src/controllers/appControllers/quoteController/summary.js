const mongoose = require('mongoose');
const moment = require('moment');

const Model = mongoose.model('Quote');
const { loadSettings } = require('@/middlewares/settings');

const summary = async (req, res) => {
  let defaultType = 'month';

  const { type } = req.query;

  const settings = await loadSettings();

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

        // date: {
        //   $gte: startDate.toDate(),
        //   $lte: endDate.toDate(),
        // },
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

  const total = result.reduce((acc, item) => acc + item.total_amount, 0);

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
};
module.exports = summary;
