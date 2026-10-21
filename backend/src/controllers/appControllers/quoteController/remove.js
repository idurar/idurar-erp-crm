const mongoose = require('mongoose');

const Quote = mongoose.model('Quote');

module.exports = async (req, res) => {
  const quote = await Quote.findOne({ _id: req.params.id, removed: false });
  if (!quote) {
    return res.status(404).json({ success: false, result: null, message: 'Angebot nicht gefunden.' });
  }
  if (quote.converted?.invoice || quote.converted?.orderConfirmation) {
    return res.status(409).json({
      success: false,
      result: null,
      message: 'Ein bereits umgewandeltes Angebot kann nicht gelöscht werden.',
    });
  }
  quote.removed = true;
  await quote.save();
  return res.status(200).json({ success: true, result: quote, message: 'Angebot wurde gelöscht.' });
};
