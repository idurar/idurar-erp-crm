const mongoose = require('mongoose');
const moment = require('moment');

const Model = mongoose.model('Invoice');

const { loadSettings } = require('@/middlewares/settings');

const summary = async (req, res) => {
  let defaultType = 'month';

  const { type, period } = req.query;

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

  const currentDate =
    period && moment(period, ['YYYY-MM', 'YYYY'], true).isValid()
      ? moment(period, ['YYYY-MM', 'YYYY'], true)
      : moment();
  let startDate = currentDate.clone().startOf(defaultType);
  let endDate = currentDate.clone().endOf(defaultType);
  const previousStartDate = startDate.clone().subtract(1, defaultType);
  const previousEndDate = endDate.clone().subtract(1, defaultType);

  const statuses = [
    'draft',
    'pending',
    'issued',
    'sent',
    'overdue',
    'paid',
    'unpaid',
    'partially',
  ];

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
      percentage: totalInvoices?.count ? Math.round((item.count / totalInvoices.count) * 100) : 0,
    };
  });

  const paymentStatusResultMap = paymentStatusResult.map((item) => {
    return {
      ...item,
      percentage: totalInvoices?.count ? Math.round((item.count / totalInvoices.count) * 100) : 0,
    };
  });

  const overdueResultMap = overdueResult.map((item) => {
    return {
      ...item,
      status: 'overdue',
      percentage: totalInvoices?.count ? Math.round((item.count / totalInvoices.count) * 100) : 0,
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

        // date: {
        //   $gte: startDate.toDate(),
        //   $lte: endDate.toDate(),
        // },
        paymentStatus: {
          $in: ['unpaid', 'partially'],
        },
      },
    },
    {
      $group: {
        _id: null,
        total_amount: {
          $sum: {
            $subtract: ['$total', '$credit'],
          },
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

  const overdueDays = Math.max(0, Math.min(Number(req.query.overdueDays) || 7, 3650));
  const overdueCutoff = moment().subtract(overdueDays, 'days').endOf('day').toDate();
  const overdue = await Model.aggregate([
    {
      $match: {
        removed: false,
        paymentStatus: { $in: ['unpaid', 'partially'] },
        expiredDate: { $lte: overdueCutoff },
      },
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        total_amount: {
          $sum: { $subtract: [{ $subtract: ['$total', '$discount'] }, '$credit'] },
        },
      },
    },
  ]);

  const [previousPeriod, upcoming] = await Promise.all([
    Model.aggregate([
      {
        $match: {
          removed: false,
          date: { $gte: previousStartDate.toDate(), $lte: previousEndDate.toDate() },
        },
      },
      { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } },
    ]),
    Model.aggregate([
      {
        $match: {
          removed: false,
          paymentStatus: { $in: ['unpaid', 'partially'] },
          expiredDate: { $gte: new Date(), $lte: moment().add(14, 'days').endOf('day').toDate() },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $subtract: ['$total', '$credit'] } },
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  const currentTotal = totalInvoices?.total || 0;
  const previousTotal = previousPeriod[0]?.total || 0;
  const changePercentage = previousTotal
    ? Math.round(((currentTotal - previousTotal) / previousTotal) * 100)
    : currentTotal > 0
      ? 100
      : 0;

  const finalResult = {
    total: totalInvoices?.total,
    count: totalInvoices?.count || 0,
    total_undue: unpaid.length > 0 ? unpaid[0].total_amount : 0,
    total_overdue: overdue.length > 0 ? overdue[0].total_amount : 0,
    overdue_count: overdue.length > 0 ? overdue[0].count : 0,
    overdue_days: overdueDays,
    previous_total: previousTotal,
    change_percentage: changePercentage,
    upcoming_due_total: upcoming[0]?.total || 0,
    upcoming_due_count: upcoming[0]?.count || 0,
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
