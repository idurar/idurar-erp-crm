const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const { runAtomic } = require('@/services/transactionService');

const OrderConfirmation = mongoose.model('OrderConfirmation');
const Quote = mongoose.model('Quote');
const controller = createCRUDController('OrderConfirmation');

controller.create = async (req, res) => {
  const result = await new OrderConfirmation({
    ...req.body,
    removed: false,
    sourceQuote: undefined,
    createdBy: req.admin._id,
  }).save();
  return res.status(200).json({
    success: true,
    result,
    message: 'Auftragsbestätigung wurde erstellt.',
  });
};

controller.update = async (req, res) => {
  const document = await OrderConfirmation.findOne({ _id: req.params.id, removed: false });
  if (!document) {
    return res.status(404).json({ success: false, result: null, message: 'Auftragsbestätigung nicht gefunden.' });
  }
  const protectedFields = ['_id', 'createdBy', 'sourceQuote', 'created', 'removed'];
  for (const [key, value] of Object.entries(req.body)) {
    if (!protectedFields.includes(key)) document.set(key, value);
  }
  const result = await document.save();
  return res.status(200).json({
    success: true,
    result,
    message: 'Auftragsbestätigung wurde aktualisiert.',
  });
};

controller.fromQuote = async (req, res) => {
  const requestedDeposit = Number(req.body.depositPercentage ?? 30);
  if (!Number.isFinite(requestedDeposit) || requestedDeposit <= 0 || requestedDeposit >= 100) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Die Anzahlung muss größer als 0 % und kleiner als 100 % sein.',
    });
  }

  let result;
  try {
    result = await runAtomic(async (session) => {
    const quote = await Quote.findOne({ _id: req.params.id, removed: false }).session(session);
    if (!quote) return null;

    const existing = await OrderConfirmation.findOne({ sourceQuote: quote._id, removed: false }).session(session);
    if (existing) return existing;

    const [confirmation] = await OrderConfirmation.create([{
      date: new Date(),
      client: quote.client?._id || quote.client,
      sourceQuote: quote._id,
      status: 'draft',
      items: quote.items.map((item) => ({
        article: item.article,
        itemName: item.itemName,
        description: item.description,
        unit: item.unit,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount,
      })),
      taxRate: quote.taxRate,
      currency: quote.currency,
      notes: quote.notes,
      paymentSchedule: [
        { label: 'Anzahlung', percentage: requestedDeposit, dueTrigger: 'confirmation' },
        { label: 'Restzahlung', percentage: 100 - requestedDeposit, dueTrigger: 'completion' },
      ],
      createdBy: req.admin._id,
    }], session ? { session } : undefined);

    quote.set('converted.orderConfirmation', confirmation._id);
    quote.status = 'accepted';
    await quote.save(session ? { session } : undefined);
      return confirmation;
    });
  } catch (error) {
    if (error?.code !== 11000) throw error;
    result = await OrderConfirmation.findOne({ sourceQuote: req.params.id, removed: false });
    if (!result) throw error;
  }

  if (!result) {
    return res.status(404).json({ success: false, result: null, message: 'Angebot nicht gefunden.' });
  }
  return res.status(200).json({
    success: true,
    result,
    message: 'Auftragsbestätigung wurde aus dem Angebot erstellt.',
  });
};

module.exports = controller;
