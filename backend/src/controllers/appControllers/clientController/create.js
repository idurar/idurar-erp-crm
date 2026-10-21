const mongoose = require('mongoose');

const Client = mongoose.model('Client');

const normalize = (value) => String(value || '').trim();

const create = async (req, res) => {
  const email = normalize(req.body.email).toLowerCase();
  const vatNumber = normalize(req.body.vatNumber).toUpperCase();
  const or = [];
  if (email) or.push({ email });
  if (vatNumber) or.push({ vatNumber });

  const duplicate = or.length
    ? await Client.findOne({ removed: false, $or: or }).select('_id name email vatNumber').lean()
    : null;

  if (duplicate) {
    return res.status(409).json({
      success: false,
      result: duplicate,
      message: `Möglicher Kunden-Duplikat: ${duplicate.name}`,
    });
  }

  const result = await Client.create({
    ...req.body,
    email: email || undefined,
    vatNumber: vatNumber || undefined,
    createdBy: req.admin._id,
    assigned: req.admin._id,
    removed: false,
  });
  return res.status(200).json({ success: true, result, message: 'Kunde wurde angelegt' });
};

module.exports = create;
