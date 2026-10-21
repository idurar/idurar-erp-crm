const mongoose = require('mongoose');
const Client = mongoose.model('Client');

module.exports = async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const vatNumber = String(req.body.vatNumber || '').trim().toUpperCase();
  const alternatives = [];
  if (email) alternatives.push({ email });
  if (vatNumber) alternatives.push({ vatNumber });
  const duplicate = alternatives.length
    ? await Client.findOne({ _id: { $ne: req.params.id }, removed: false, $or: alternatives }).select('_id name').lean()
    : null;
  if (duplicate) return res.status(409).json({ success: false, result: duplicate, message: `Möglicher Kunden-Duplikat: ${duplicate.name}` });
  const result = await Client.findOneAndUpdate(
    { _id: req.params.id, removed: false },
    { ...req.body, email: email || undefined, vatNumber: vatNumber || undefined, updated: new Date() },
    { new: true, runValidators: true }
  );
  if (!result) return res.status(404).json({ success: false, result: null, message: 'Kunde nicht gefunden' });
  return res.status(200).json({ success: true, result, message: 'Kunde wurde aktualisiert' });
};
