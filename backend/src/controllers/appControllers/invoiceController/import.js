const mongoose = require('mongoose');
const parseFile = require('./parseFile');

const STATUSES = ['draft', 'pending', 'sent'];
const DEFAULT_CURRENCY = 'INR';

const round = (n) => Math.round((n + Number.EPSILON) * 100) / 100;
const num = (v, d = 0) => (v === '' || v == null ? d : Number(v));
const toDate = (v) => {
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
};

module.exports = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  let rows;
  try {
    rows = await parseFile(req.file);
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
  if (!rows.length) {
    return res.status(400).json({ success: false, message: 'File has no data rows' });
  }

  const Client = mongoose.model('Client');
  const Invoice = mongoose.model('Invoice');


  const clientMap = new Map();
  (await Client.find({ removed: false }).select('email')).forEach((c) => {
    if (c.email) clientMap.set(c.email.toLowerCase(), c._id);
  });

  // existing "number-year"
  const used = new Set(
    (await Invoice.find({ removed: false }).select('number year')).map(
      (i) => `${i.number}-${i.year}`
    )
  );


  const groups = new Map();
  rows.forEach((r, i) => {
    const key = r.number;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push({ r, row: i + 2 });
  });

  const valid = [];
  const errors = [];

  for (const [key, group] of groups) {
    const { r: first, row } = group[0];
    const fail = (error) => errors.push({ row, invoice: key, error });

    const number = Number(key);
    if (!key || !Number.isInteger(number) || number <= 0) { fail('invalid number'); continue; }

    const date = toDate(first.date);
    if (!date) { fail('invalid date'); continue; }
    const expiredDate = toDate(first.expireddate);
    if (!expiredDate) { fail('invalid expiredDate'); continue; }
    if (expiredDate < date) { fail('expiredDate before date'); continue; }

    const clientId = clientMap.get((first.client || '').toLowerCase());
    if (!clientId) { fail('client not found'); continue; }

    const year = date.getFullYear();
    if (used.has(`${number}-${year}`)) { fail('invoice number already exists'); continue; }

    const status = (first.status || 'draft').toLowerCase();
    if (!STATUSES.includes(status)) { fail(`invalid status "${first.status}"`); continue; }

    const taxRate = num(first.taxrate);
    const discount = num(first.discount);
    if ([taxRate, discount].some((n) => isNaN(n) || n < 0)) { fail('invalid taxRate/discount'); continue; }


    const items = [];
    let itemError = null;
    for (const { r, row: itemRow } of group) {
      const itemName = (r.itemname || '').trim();
      const quantity = num(r.quantity, 1);
      const price = num(r.price, NaN);
      if (!itemName) { itemError = { row: itemRow, error: 'itemName missing' }; break; }
      if (isNaN(quantity) || quantity <= 0) { itemError = { row: itemRow, error: 'invalid quantity' }; break; }
      if (isNaN(price) || price < 0) { itemError = { row: itemRow, error: 'invalid price' }; break; }
      items.push({
        itemName,
        description: r.description || '',
        quantity,
        price,
        total: round(quantity * price),
      });
    }
    if (itemError) { errors.push({ ...itemError, invoice: key }); continue; }

    const subTotal = round(items.reduce((s, it) => s + it.total, 0));
    const taxTotal = round((subTotal * taxRate) / 100);
    const total = round(subTotal + taxTotal);

    used.add(`${number}-${year}`);
    valid.push({
      number,
      year,
      date,
      expiredDate,
      client: clientId,
      currency: (first.currency || DEFAULT_CURRENCY).toUpperCase(),
      taxRate,
      discount,
      status,
      notes: first.notes || '',
      items,
      subTotal,
      taxTotal,
      total,
      createdBy: req.admin._id,
    });
  }

  if (req.query.preview === 'true') {
    return res.json({
      success: true,
      result: { total: rows.length, invoices: groups.size, valid: valid.length, errors },
    });
  }

  if (valid.length) await Invoice.insertMany(valid);

  return res.json({
    success: true,
    result: { total: rows.length, invoices: groups.size, inserted: valid.length, errors },
  });
};