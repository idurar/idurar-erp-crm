const mongoose = require('mongoose');
const Joi = require('joi');
const { nextDateFor } = require('@/services/recurringInvoiceService');

const Invoice = mongoose.model('Invoice');

const schema = Joi.object({
  recurring: Joi.string().valid('weekly', 'monthly', 'quarterly', 'annually').required(),
  recurringActive: Joi.boolean().required(),
  nextRecurringDate: Joi.date().allow(null).optional(),
  recurringEndDate: Joi.date().allow(null).optional(),
});

module.exports = async (req, res) => {
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, result: null, message: error.message });
  }

  const invoice = await Invoice.findOne({ _id: req.params.id, removed: false });
  if (!invoice) {
    return res.status(404).json({ success: false, result: null, message: 'Rechnung nicht gefunden' });
  }
  if (invoice.documentType === 'credit_note' || ['cancelled', 'refunded'].includes(invoice.status)) {
    return res.status(409).json({
      success: false,
      result: invoice,
      message: 'Für diese Rechnung kann keine Wiederholung eingerichtet werden.',
    });
  }
  const staleProcessingLock = new Date(Date.now() - 30 * 60 * 1000);
  if (invoice.recurringProcessingAt && invoice.recurringProcessingAt >= staleProcessingLock) {
    return res.status(409).json({
      success: false,
      result: invoice,
      message: 'Der Wiederholungsplan wird gerade verarbeitet. Bitte kurz erneut versuchen.',
    });
  }
  if (invoice.recurringProcessingAt) invoice.recurringProcessingAt = undefined;

  const nextRecurringDate = value.nextRecurringDate
    ? new Date(value.nextRecurringDate)
    : nextDateFor(invoice.date, value.recurring);
  const recurringEndDate = value.recurringEndDate ? new Date(value.recurringEndDate) : undefined;
  if (value.recurringActive && nextRecurringDate <= new Date()) {
    return res.status(400).json({
      success: false,
      result: invoice,
      message: 'Die nächste Ausführung muss in der Zukunft liegen.',
    });
  }
  if (value.recurringActive && recurringEndDate && recurringEndDate < nextRecurringDate) {
    return res.status(400).json({
      success: false,
      result: invoice,
      message: 'Das Enddatum darf nicht vor der nächsten Ausführung liegen.',
    });
  }

  invoice.recurring = value.recurring;
  invoice.recurringActive = value.recurringActive;
  invoice.nextRecurringDate = nextRecurringDate;
  invoice.recurringAnchorDate = nextRecurringDate;
  invoice.recurringEndDate = recurringEndDate;
  invoice.recurringFailedAt = undefined;
  invoice.recurringLastError = undefined;
  invoice.updated = new Date();
  await invoice.save();

  return res.status(200).json({
    success: true,
    result: invoice,
    message: value.recurringActive
      ? 'Wiederkehrende Rechnung wurde aktiviert.'
      : 'Wiederkehrende Rechnung wurde pausiert.',
  });
};
