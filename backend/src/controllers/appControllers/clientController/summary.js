const mongoose = require('mongoose');
const moment = require('moment');

const InvoiceModel = mongoose.model('Invoice');

const summary = async (Model, req, res) => {
  let defaultType = 'month';
  const { type } = req.query;

  if (type && ['week', 'month', 'year'].includes(type)) {
    defaultType = type;
  } else if (type) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Invalid type',
    });
  }

  const currentDate = moment();
  let startDate = currentDate.clone().startOf(defaultType);
  let endDate = currentDate.clone().endOf(defaultType);

  const pipeline = [
    {
      $facet: {
        totalClients: [
          {
            $match: {
              removed: false,
              enabled: true,
            },
          },
          {
            $count: 'count',
          },
        ],
        newClients: [
          {
            $match: {
              removed: false,
              created: { $gte: startDate.toDate(), $lte: endDate.toDate() },
              enabled: true,
            },
          },
          {
            $count: 'count',
          },
        ],
        activeClients: [
          { $match: { removed: false, enabled: true } },
          {
            $lookup: {
              from: InvoiceModel.collection.name,
              let: { clientId: '$_id' },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ['$client', '$$clientId'] },
                    removed: false,
                    documentType: 'invoice',
                    issuedAt: { $ne: null },
                    status: { $nin: ['cancelled', 'refunded'] },
                  },
                },
                { $limit: 1 },
              ],
              as: 'invoice',
            },
          },
          {
            $match: {
              'invoice.0': { $exists: true },
            },
          },
          {
            $group: {
              _id: '$_id',
            },
          },
          {
            $count: 'count',
          },
        ],
      },
    },
  ];

  const aggregationResult = await Model.aggregate(pipeline);

  const result = aggregationResult[0];
  const totalClients = result.totalClients[0] ? result.totalClients[0].count : 0;
  const totalNewClients = result.newClients[0] ? result.newClients[0].count : 0;
  const activeClients = result.activeClients[0] ? result.activeClients[0].count : 0;

  const topClients = await InvoiceModel.aggregate([
    {
      $match: {
        removed: false,
        documentType: 'invoice',
        issuedAt: { $ne: null },
        status: { $nin: ['cancelled', 'refunded'] },
      },
    },
    { $group: { _id: '$client', revenue: { $sum: '$credit' }, invoiced: { $sum: '$total' }, lastInvoice: { $max: '$date' } } },
    { $sort: { revenue: -1, invoiced: -1 } },
    { $lookup: { from: Model.collection.name, localField: '_id', foreignField: '_id', as: 'client' } },
    { $unwind: '$client' },
    { $match: { 'client.removed': false, 'client.enabled': true } },
    { $project: { _id: 1, name: '$client.name', revenue: 1, invoiced: 1, open: { $subtract: ['$invoiced', '$revenue'] }, lastInvoice: 1 } },
  ]);

  const totalActiveClientsPercentage = totalClients > 0 ? (activeClients / totalClients) * 100 : 0;
  const totalNewClientsPercentage = totalClients > 0 ? (totalNewClients / totalClients) * 100 : 0;

  return res.status(200).json({
    success: true,
    result: {
      new: Math.round(totalNewClientsPercentage),
      active: Math.round(totalActiveClientsPercentage),
      total: totalClients,
      newCount: totalNewClients,
      activeCount: activeClients,
      topClients,
    },
    message: 'Successfully get summary of new clients',
  });
};

module.exports = summary;
