const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

const controller = createCRUDController('Expense');
controller.update = async (req, res) => {
  const Expense = mongoose.model('Expense');
  const document = await Expense.findOne({ _id: req.params.id, removed: false });
  if (!document) return res.status(404).json({ success: false, result: null, message: 'Ausgabe wurde nicht gefunden.' });
  const changes = { ...req.body };
  delete changes.createdBy;
  delete changes.removed;
  document.set(changes);
  await document.save();
  return res.status(200).json({ success: true, result: document, message: 'Ausgabe wurde aktualisiert.' });
};
module.exports = controller;
