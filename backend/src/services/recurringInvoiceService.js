const mongoose = require('mongoose');
const moment = require('moment');
const logger = require('@/utils/logger');

const INTERVALS = {
  weekly: [1, 'week'],
  monthly: [1, 'month'],
  quarterly: [3, 'months'],
  annually: [1, 'year'],
};

const nextDateFor = (date, frequency, anchorDate = date) => {
  const interval = INTERVALS[frequency];
  if (!interval) throw new Error(`Unbekanntes Rechnungsintervall: ${frequency}`);
  if (frequency === 'weekly') return moment.utc(date).add(1, 'week').toDate();

  const anchor = moment.utc(anchorDate);
  const next = moment.utc(date);
  if (frequency === 'annually') {
    next.add(1, 'year').month(anchor.month()).date(1);
  } else {
    next.date(1).add(interval[0], interval[1]);
  }
  return next.date(Math.min(anchor.date(), next.daysInMonth())).toDate();
};

const cloneItems = (items = []) =>
  items.map(({ article, itemName, description, unit, discount, quantity, price, total }) => ({
    article: article?._id || article,
    itemName,
    description,
    unit,
    discount,
    quantity,
    price,
    total,
  }));

const buildRecurringDraft = (source, occurrenceDate) => {
  const paymentTermDays = Math.max(
    0,
    moment.utc(source.expiredDate).diff(moment.utc(source.date), 'days')
  );
  const date = moment.utc(occurrenceDate);
  return {
    client: source.client?._id || source.client,
    clientVatNumber: source.clientVatNumber,
    year: date.year(),
    date: date.toDate(),
    serviceDate: date.toDate(),
    expiredDate: date.clone().add(paymentTermDays || 14, 'days').toDate(),
    items: cloneItems(source.items),
    taxRate: source.taxRate,
    subTotal: source.subTotal,
    taxTotal: source.taxTotal,
    total: source.total,
    currency: source.currency,
    discount: source.discount,
    paymentTermsText: source.paymentTermsText,
    footerText: source.footerText,
    notes: source.notes,
    status: 'draft',
    paymentStatus: 'unpaid',
    credit: 0,
    createdBy: source.createdBy?._id || source.createdBy,
    pdf: undefined,
    recurring: 'none',
    recurringActive: false,
    recurringSource: source._id,
    recurringOccurrenceDate: occurrenceDate,
  };
};

const createRecurringDraft = async (source, occurrenceDate) => {
  const Invoice = mongoose.model('Invoice');
  const existing = await Invoice.exists({
    recurringSource: source._id,
    recurringOccurrenceDate: occurrenceDate,
    removed: false,
  });
  if (existing) return null;

  const invoice = buildRecurringDraft(source, occurrenceDate);

  try {
    return await Invoice.create(invoice);
  } catch (error) {
    if (error?.code === 11000) return null;
    throw error;
  }
};

const processRecurringInvoices = async (now = new Date()) => {
  const Invoice = mongoose.model('Invoice');
  let created = 0;
  let processedSources = 0;
  const staleLock = moment.utc(now).subtract(30, 'minutes').toDate();

  while (processedSources < 100) {
    const source = await Invoice.findOneAndUpdate(
      {
        removed: false,
        documentType: 'invoice',
        issuedAt: { $ne: null },
        status: { $nin: ['cancelled', 'refunded'] },
        recurringActive: true,
        recurring: { $in: Object.keys(INTERVALS) },
        nextRecurringDate: { $lte: now },
        $or: [
          { recurringProcessingAt: { $exists: false } },
          { recurringProcessingAt: null },
          { recurringProcessingAt: { $lt: staleLock } },
        ],
      },
      { $set: { recurringProcessingAt: now } },
      { new: true, sort: { nextRecurringDate: 1 } }
    );
    if (!source) break;
    processedSources += 1;

    try {
      let occurrenceDate = new Date(source.nextRecurringDate);
      let iterations = 0;
      while (occurrenceDate <= now && iterations < 120) {
        if (source.recurringEndDate && occurrenceDate > source.recurringEndDate) {
          source.recurringActive = false;
          break;
        }
        const result = await createRecurringDraft(source, occurrenceDate);
        if (result) created += 1;
        occurrenceDate = nextDateFor(
          occurrenceDate,
          source.recurring,
          source.recurringAnchorDate || source.nextRecurringDate
        );
        iterations += 1;
      }
      source.nextRecurringDate = occurrenceDate;
      if (source.recurringEndDate && occurrenceDate > source.recurringEndDate)
        source.recurringActive = false;
      source.recurringProcessingAt = undefined;
      await source.save();
    } catch (error) {
      await Invoice.updateOne(
        { _id: source._id, recurringProcessingAt: now },
        {
          $set: {
            recurringActive: false,
            recurringFailedAt: new Date(),
            recurringLastError: String(error?.message || error).slice(0, 500),
          },
          $unset: { recurringProcessingAt: 1 },
        }
      );
      logger.error('Recurring invoice source paused after processing error', {
        sourceId: source._id,
        error: error?.message || String(error),
      });
    }
  }
  return created;
};

module.exports = {
  nextDateFor,
  buildRecurringDraft,
  createRecurringDraft,
  processRecurringInvoices,
};
