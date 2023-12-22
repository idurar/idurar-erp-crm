const mongoose = require('mongoose');

const paginatedList = async (userModel, req, res) => {
  const User = mongoose.model(userModel);

  const page = req.query.page || 1;
  const limit = parseInt(req.query.items) || 10;
  const skip = page * limit - limit;

  //  Query the database for a list of all results
  const resultsPromise = User.find({ removed: false, enabled: true })
    .skip(skip)
    .limit(limit)
    .sort({ created: 'desc' })
    .populate()
    .exec();
  // Counting the total documents
  const countPromise = User.countDocuments({ removed: false });
  // Resolving both promises
  const [result, count] = await Promise.all([resultsPromise, countPromise]);
  // Calculating total pages
  const pages = Math.ceil(count / limit);

  // Getting Pagination Object
  const pagination = { page, pages, count };
  if (count > 0) {
    return res.status(200).json({
      success: true,
      result,
      pagination,
      message: 'Successfully found all documents',
    });
  } else {
    return res.status(203).json({
      success: false,
      result: [],
      pagination,
      message: 'Collection is Empty',
    });
  }
};

module.exports = paginatedList;
