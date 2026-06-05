const mongoose = require('mongoose');
const Model = mongoose.model('Quote');

const remove = async (req, res) => {
  const deletedQuote = await Model.findOneAndUpdate(
    { _id: req.params.id, removed: false },
    { $set: { removed: true } }
  ).exec();

  if (!deletedQuote) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'Quote not found',
    });
  }

  return res.status(200).json({
    success: true,
    result: deletedQuote,
    message: 'Quote deleted successfully',
  });
};

module.exports = remove;