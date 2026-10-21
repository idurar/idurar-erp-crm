const mongoose = require('mongoose');

const Invoice = mongoose.model('Invoice');
const { sendReminderEmail } = require('@/services/documentEmail');

const remind = async (req, res) => {
  const invoice = await Invoice.findOne({ _id: req.params.id, removed: false });

  if (!invoice) {
    return res
      .status(404)
      .json({ success: false, result: null, message: 'Rechnung nicht gefunden' });
  }

  if (invoice.paymentStatus === 'paid') {
    return res
      .status(400)
      .json({ success: false, result: null, message: 'Die Rechnung ist bereits bezahlt' });
  }

  if (!invoice.issuedAt) {
    return res.status(409).json({
      success: false,
      result: null,
      message: 'Nur verbindlich ausgestellte Rechnungen können gemahnt werden',
    });
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
  const fee = Math.max(0, Number(req.body.fee) || 0);
  const note = String(req.body.note || '').trim();

  const mail = await sendReminderEmail({ invoice, level, dueDate, fee, note });
  if (mail.status !== 200) {
    return res.status(mail.status).json({ success: false, result: null, message: mail.message });
  }

  invoice.reminderLevel = level;
  invoice.nextReminderDate = dueDate;
  invoice.isOverdue = true;
  invoice.status = 'overdue';
  invoice.dunningFees = Number(invoice.dunningFees || 0) + fee;
  invoice.reminderHistory.push({
    level,
    dueDate,
    fee,
    note,
  });
  invoice.updated = new Date();
  await invoice.save();

  return res.status(200).json({
    success: true,
    result: invoice,
    message: `Mahnstufe ${level} wurde per E-Mail versendet`,
  });
};

module.exports = remind;
