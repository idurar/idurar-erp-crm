const mongoose = require('mongoose');

const Client = mongoose.model('Client');
const Invoice = mongoose.model('Invoice');
const { escapeRegex, isSafeField } = require('@/helpers/search');

const paginatedList = async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.items) || 10));
  const fields = String(req.query.fields || '')
    .split(',')
    .filter(isSafeField);
  const query = { removed: false };
  if (fields.length && req.query.q) {
    query.$or = fields.map((field) => ({
      [field]: { $regex: escapeRegex(req.query.q), $options: 'i' },
    }));
  }
  const [clients, count] = await Promise.all([
    Client.find(query)
      .sort({ created: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Client.countDocuments(query),
  ]);
  const ids = clients.map((client) => client._id);
  const totals = await Invoice.aggregate([
    { $match: { removed: false, status: { $ne: 'cancelled' }, client: { $in: ids } } },
    {
      $group: {
        _id: '$client',
        invoiced: { $sum: '$total' },
        paid: { $sum: '$credit' },
        lastInvoice: { $max: '$date' },
      },
    },
  ]);
  const totalsByClient = new Map(totals.map((item) => [String(item._id), item]));
  const result = clients.map((client) => {
    const total = totalsByClient.get(String(client._id));
    return {
      ...client,
      invoiced: total?.invoiced || 0,
      openAmount: (total?.invoiced || 0) - (total?.paid || 0),
      lastInvoice: total?.lastInvoice || null,
    };
  });
  return res.status(count ? 200 : 203).json({
    success: true,
    result,
    pagination: { page, pages: Math.ceil(count / limit), count },
    message: count ? 'Kunden wurden geladen' : 'Keine Kunden vorhanden',
  });
};

module.exports = paginatedList;
