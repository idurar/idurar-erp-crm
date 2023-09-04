const mongoose = require('mongoose');
const moment = require('moment');
const Model = mongoose.model('Client');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const methods = createCRUDController('Client');

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

    const totalClients = await Model.countDocuments({
      removed: false,
      created: {
        $gte: startDate.toDate(),
        $lte: endDate.toDate(),
      },
      enabled: true,
    });

    const result = await Model.aggregate([
      {
        $match: {
          removed: false,
          created: {
            $gte: startDate.toDate(),
            $lte: endDate.toDate(),
          },
          enabled: true,
        },
      },
      {
        $group: {
          _id: null,
          new: {
            $sum: { $cond: [{ $eq: ['$removed', false] }, 1, 0] },
          },
          active: {
            $sum: { $cond: [{ $eq: ['$enabled', true] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          new: {
            $multiply: [{ $divide: ['$new', totalClients] }, 100],
          },
          active: {
            $multiply: [{ $divide: ['$active', totalClients] }, 100],
          },
        },
      },
    ]);

    if (!result || !result.length) {
      return res.status(200).json({
        success: true,
        result: {
          new: 0,
          active: 0,
        },
        message: 'Successfully get summary of new clients',
      });
    }

    return res.status(200).json({
      success: true,
      result: result[0],
      message: 'Successfully get summary of new clients',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      error: error,
      message: 'Oops there is an Error',
    });
  }
};

module.exports = methods;
