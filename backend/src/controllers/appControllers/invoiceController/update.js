const mongoose = require('mongoose');

const Model = mongoose.model('Invoice');

const custom = require('@/controllers/pdfController');

const { calculate } = require('@/helpers');
const { calculateInvoice } = require('@/helpers/invoice');
const schema = require('./schemaValidate');

const update = async (req, res) => {
  let body = req.body;

  const { error, value } = schema.validate(body);
  if (error) {
    const { details } = error;
    return res.status(400).json({
      success: false,
      result: null,
      message: details[0]?.message,
    });
  }

  const previousInvoice = await Model.findOne({
    _id: req.params.id,
    removed: false,
  });

  if (!previousInvoice) {
    return res.status(404).json({ success: false, result: null, message: 'Rechnung nicht gefunden' });
  }
  if (previousInvoice.issuedAt || previousInvoice.paymentStatus === 'paid' || ['cancelled', 'refunded'].includes(previousInvoice.status)) {
    return res.status(409).json({
      success: false,
      result: previousInvoice,
      message: 'Ausgestellte, bezahlte, stornierte oder rückerstattete Rechnungen können nicht geändert werden.',
    });
  }

  const { credit } = previousInvoice;

  if (
    value.recurringActive &&
    (value.recurring === 'none' ||
      !value.nextRecurringDate ||
      new Date(value.nextRecurringDate) <= new Date())
  ) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Für eine aktive Wiederholung sind Intervall und zukünftige Ausführung erforderlich.',
    });
  }
  if (
    value.recurringActive &&
    value.recurringEndDate &&
    new Date(value.recurringEndDate) < new Date(value.nextRecurringDate)
  ) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Das Enddatum darf nicht vor der nächsten Ausführung liegen.',
    });
  }

  const { items = [], taxRate = 0, discount = 0 } = req.body;

  if (items.length === 0) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Items cannot be empty',
    });
  }

  const { items: calculatedItems, subTotal, taxTotal, total } = calculateInvoice({ items, taxRate });

  body['subTotal'] = subTotal;
  body['taxTotal'] = taxTotal;
  body['total'] = total;
  body['items'] = calculatedItems;
  body['pdf'] = 'invoice-' + req.params.id + '.pdf';
  delete body.number;
  body.year = new Date(body.date).getFullYear();
  body.recurringAnchorDate =
    body.recurring !== 'none' && body.nextRecurringDate
      ? new Date(body.nextRecurringDate)
      : undefined;
  if (body.hasOwnProperty('currency')) {
    delete body.currency;
  }
  // Find document by id and updates with the required fields

  let paymentStatus =
    calculate.sub(total, discount) === credit ? 'paid' : credit > 0 ? 'partially' : 'unpaid';
  body['paymentStatus'] = paymentStatus;
  // Clients must not publish an invoice through the generic update endpoint.
  body['status'] = 'draft';

  const result = await Model.findOneAndUpdate({ _id: req.params.id, removed: false }, body, {
    new: true, // return the new result instead of the old one
  }).exec();

  // Returning successfull response

  return res.status(200).json({
    success: true,
    result,
    message: 'we update this document ',
  });
};

module.exports = update;
