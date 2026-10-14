const mongoose = require('mongoose');

const Quote = mongoose.model('Quote');

const summary = async (req, res) => {
  const [totals, statusCounts] = await Promise.all([
    Quote.aggregate([
      { $match: { removed: false } },
      { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } },
    ]),
    Quote.aggregate([
      { $match: { removed: false } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
  ]);

  const total = totals[0] || { total: 0, count: 0 };
  const performance = statusCounts.map(({ _id, count }) => ({
    status: _id,
    count,
    percentage: total.count ? Math.round((count / total.count) * 100) : 0,
  }));

  return res.status(200).json({
    success: true,
    result: { total: total.total, count: total.count, performance },
    message: 'Angebotsübersicht erfolgreich geladen',
  });
};

module.exports = summary;
