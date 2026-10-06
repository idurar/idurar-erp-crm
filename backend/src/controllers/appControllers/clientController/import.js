const mongoose = require('mongoose');
const parseFile = require('./parseFile');

const EMAIL_RE = /^\S+@\S+\.\S+$/;

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
  const seen = new Set(
    (await Client.find({ removed: false }).select('email'))
      .map((c) => (c.email || '').toLowerCase())
      .filter(Boolean)
  );

  const valid = [];
  const errors = [];

  rows.forEach((r, i) => {
    const row = i + 2; // header is row 1
    const name = (r.name || '').trim();
    const email = (r.email || '').trim();
    const key = email.toLowerCase();

    if (!name) return errors.push({ row, error: 'name missing' });
    if (email && !EMAIL_RE.test(email)) return errors.push({ row, error: 'invalid email' });
    if (key && seen.has(key)) return errors.push({ row, error: 'duplicate email' });
    if (key) seen.add(key);

    valid.push({
      name,
      email,
      phone: r.phone || '',
      country: r.country || '',
      address: r.address || '',
      createdBy: req.admin._id,
    });
  });

  if (req.query.preview === 'true') {
    return res.json({
      success: true,
      result: { total: rows.length, valid: valid.length, errors },
    });
  }

  if (valid.length) await Client.insertMany(valid);

  return res.json({
    success: true,
    result: { total: rows.length, inserted: valid.length, errors },
  });
};