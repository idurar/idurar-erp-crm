const mongoose = require('mongoose');
const moment = require('moment');

const Model = mongoose.model('Offer');

const summary = async (req, res) => {
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

  const response = await Model.aggregate([
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
      $facet: {
        totalOffer: [
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
      },
    },
  ]);
  let result = [];

  const totalOffers = response[0].totalOffer ? response[0].totalOffer[0] : 0;
  const statusResult = response[0].statusCounts || [];
  // const overdueResult = response[0].overdueCounts || [];

  const statusResultMap = statusResult.map((item) => {
    return {
      ...item,
      percentage: Math.round((item.count / totalOffers.count) * 100),
    };
  });

  // const overdueResultMap = overdueResult.map((item) => {
  //   return {
  //     ...item,
  //     status: 'expired',
  //     percentage: Math.round((item.count / totalOffers.count) * 100),
  //   };
  // });

  statuses.forEach((status) => {
    const found = [...statusResultMap].find((item) => item.status === status);
    if (found) {
      result.push(found);
    }
  });

  const finalResult = {
    total: totalOffers?.total,
    type,
    performance: result,
  };

  return res.status(200).json({
    success: true,
    result: finalResult,
    message: `Successfully found all invoices for the last ${defaultType}`,
  });
};

module.exports = summary;
