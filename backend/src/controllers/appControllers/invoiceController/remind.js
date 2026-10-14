const mongoose = require('mongoose');

const Invoice = mongoose.model('Invoice');

const remind = async (req, res) => {
  const invoice = await Invoice.findOne({ _id: req.params.id, removed: false });

  if (!invoice) {
    return res.status(404).json({ success: false, result: null, message: 'Rechnung nicht gefunden' });
  }

  if (invoice.paymentStatus === 'paid') {
    return res.status(400).json({ success: false, result: null, message: 'Die Rechnung ist bereits bezahlt' });
  }

  if (new Date(invoice.expiredDate) >= new Date()) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Eine Mahnung ist erst nach Ablauf der Zahlungsfrist möglich',
    });
  }

  const level = Math.min((invoice.reminderLevel || 0) + 1, 3);
  const paymentPeriodDays = Math.max(1, Math.min(Number(req.body.paymentPeriodDays) || 7, 30));
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + paymentPeriodDays);

  invoice.reminderLevel = level;
  invoice.nextReminderDate = dueDate;
  invoice.isOverdue = true;
  invoice.status = 'pending';
  invoice.reminderHistory.push({
    level,
    dueDate,
    fee: Math.max(0, Number(req.body.fee) || 0),
    note: String(req.body.note || '').trim(),
  });
  invoice.updated = new Date();
  await invoice.save();

  return res.status(200).json({
    success: true,
    result: invoice,
    message: `Mahnstufe ${level} wurde erfasst`,
  });
};

module.exports = remind;
