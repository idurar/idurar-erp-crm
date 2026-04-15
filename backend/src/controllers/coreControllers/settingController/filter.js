const mongoose = require('mongoose');
const Model = mongoose.model('Setting');

const filter = async (req, res) => {
  const { filter, equal } = req.query;

  let filterCondition = {};
  if (filter && equal !== undefined) {
    filterCondition = { [filter]: equal };
  }

  const result = await Model.find({
    removed: false,
    isPrivate: false,
    ...filterCondition,
  }).exec();

  if (result.length > 0) {
    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully found all documents',
    });
  } else {
    return res.status(203).json({
      success: false,
      result: [],
      message: 'Collection is Empty',
    });
  }
};

module.exports = filter;
