const mongoose = require('mongoose');
const Admin = mongoose.model('Admin');

const paginatedList = async (req, res) => {
  const page = req.query.page || 1;
  const limit = parseInt(req.query.items) || 10;
  const skip = page * limit - limit;
  try {
    //  Query the database for a list of all results
    const resultsPromise = Admin.find({ removed: false })
      .skip(skip)
      .limit(limit)
      .sort({ created: 'desc' })
      .populate();
    // Counting the total documents
    const countPromise = Admin.count({ removed: false });
    // Resolving both promises
    const [result, count] = await Promise.all([resultsPromise, countPromise]);
    // Calculating total pages
    const pages = Math.ceil(count / limit);

    // Getting Pagination Object
    const pagination = { page, pages, count };
    if (count > 0) {
      for (let admin of result) {
        admin.password = undefined;
        admin.loggedSessions = undefined;
      }
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
  } catch (error) {
    return res.status(500).json({ success: false, result: [], message: error.message, error });
  }
};

module.exports = paginatedList;
