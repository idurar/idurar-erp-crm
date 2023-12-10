const mongoose = require('mongoose');

const listAll = async (userModel, req, res) => {
  const User = mongoose.model(userModel);

  const limit = parseInt(req.query.items) || 100;

  //  Query the database for a list of all results
  const result = await User.find({ removed: false })
    .limit(limit)
    .sort({ created: 'desc' })
    .populate()
    .exec();
  // Counting the total documents
  // Resolving both promises
  // Calculating total pages

  // Getting Pagination Object
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

module.exports = listAll;
