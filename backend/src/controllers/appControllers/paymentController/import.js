const mongoose = require('mongoose');
const parseFile = require('./parseFile');

const round = (n) => Math.round((n + Number.EPSILON) * 100) / 100;
const toDate = (v) => {
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
};
const isDigits = (v) => /^\d+$/.test(String(v || '').trim());

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

  const Payment = mongoose.model('Payment');
  const Invoice = mongoose.model('Invoice');


  const invoicesByNumber = new Map();
  (await Invoice.find({ removed: false }).lean()).forEach((inv) => {
    if (!invoicesByNumber.has(inv.number)) invoicesByNumber.set(inv.number, []);
    invoicesByNumber.get(inv.number).push(inv);
  });

  
  const usedNumbers = new Set(
    (await Payment.find({ removed: false }).select('number').lean()).map((p) => p.number)
  );

  
  const state = new Map();

  const valid = [];
  const errors = [];

  rows.forEach((r, i) => {
    const row = i + 2;
    const fail = (error) => errors.push({ row, invoice: r.invoice, error });

    
    if (!isDigits(r.number)) return fail('number must be digits only');
    const number = Number(r.number);
    if (number <= 0) return fail('invalid number');
    if (usedNumbers.has(number)) return fail('payment number already exists');

    
    if (!isDigits(r.invoice)) return fail('invoice must be digits only');
    const candidates = invoicesByNumber.get(Number(r.invoice)) || [];
    let matches = candidates;
    if (r.year) matches = candidates.filter((c) => c.year === Number(r.year));
    if (!matches.length) return fail('invoice not found');
    if (matches.length > 1) return fail('invoice number matches several years, add year column');
    const inv = matches[0];

    if (inv.status === 'cancelled') return fail('invoice is cancelled');

    
    const amount = Number(r.amount);
    if (!r.amount || isNaN(amount) || amount <= 0) return fail('invalid amount');

    
    const currency = (r.currency || inv.currency || '').toUpperCase();
    if (inv.currency && currency !== inv.currency) {
      return fail(`currency ${currency} does not match invoice (${inv.currency})`);
    }

    
    const date = r.date ? toDate(r.date) : new Date();
    if (!date) return fail('invalid date');

    
    const key = String(inv._id);
    if (!state.has(key)) state.set(key, { inv, credit: inv.credit || 0, ids: [] });
    const st = state.get(key);
    if (round(st.credit + amount) > round(inv.total)) {
      return fail('amount exceeds invoice balance');
    }

    const _id = new mongoose.Types.ObjectId();
    st.credit = round(st.credit + amount);
    st.ids.push(_id);
    usedNumbers.add(number);

    valid.push({
      _id,
      number,
      invoice: inv._id,
      client: inv.client && inv.client._id ? inv.client._id : inv.client,
      date,
      amount,
      currency,
      ref: r.ref || '',
      description: r.description || '',
      createdBy: req.admin._id,
    });
  });

  if (req.query.preview === 'true') {
    return res.json({
      success: true,
      result: { total: rows.length, valid: valid.length, errors },
    });
  }

  if (valid.length) {
    await Payment.insertMany(valid);


    const ops = [];
    for (const { inv, credit, ids } of state.values()) {
      if (!ids.length) continue;
      const paymentStatus =
        round(credit) >= round(inv.total) ? 'paid' : credit > 0 ? 'partially' : 'unpaid';
      ops.push({
        updateOne: {
          filter: { _id: inv._id },
          update: {
            $push: { payment: { $each: ids } },
            $set: { credit, paymentStatus, updated: new Date() },
          },
        },
      });
    }
    if (ops.length) await Invoice.bulkWrite(ops);
  }

  return res.json({
    success: true,
    result: { total: rows.length, inserted: valid.length, errors },
  });
};