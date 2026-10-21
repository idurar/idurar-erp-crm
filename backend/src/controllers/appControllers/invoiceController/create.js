const mongoose = require('mongoose');

const Model = mongoose.model('Invoice');

const { calculate } = require('@/helpers');
const { calculateInvoice } = require('@/helpers/invoice');
const { loadSettings } = require('@/middlewares/settings');
const schema = require('./schemaValidate');

const create = async (req, res) => {
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

  const { items = [], taxRate = 0, discount = 0 } = value;
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

  delete value.number;
  value.year = new Date(value.date).getFullYear();
  body = { ...value };
  if (value.recurring !== 'none' && value.nextRecurringDate) {
    body.recurringAnchorDate = new Date(value.nextRecurringDate);
  }

  const {
    items: calculatedItems,
    subTotal,
    taxTotal,
    total,
  } = calculateInvoice({ items, taxRate });

  body['subTotal'] = subTotal;
  body['taxTotal'] = taxTotal;
  body['total'] = total;
  body['items'] = calculatedItems;
  const settings = await loadSettings();
  body['currency'] = settings.default_currency_code || 'EUR';

  let paymentStatus = calculate.sub(total, discount) === 0 ? 'paid' : 'unpaid';

  body['paymentStatus'] = paymentStatus;
  // A newly saved invoice is always editable. Publishing is a separate,
  // explicit operation handled by the issue endpoint.
  body['status'] = 'draft';
  body['createdBy'] = req.admin._id;

  // Creating a new document in the collection
  let result;
  try {
    result = await new Model(body).save();
  } catch (error) {
    throw error;
  }
  const fileId = 'invoice-' + result._id + '.pdf';
  const updateResult = await Model.findOneAndUpdate(
    { _id: result._id },
    { pdf: fileId },
    {
      new: true,
    }
  ).exec();
  // Returning successfull response

  // Returning successfull response
  return res.status(200).json({
    success: true,
    result: updateResult,
    message: 'Invoice created successfully',
  });
};

module.exports = create;
