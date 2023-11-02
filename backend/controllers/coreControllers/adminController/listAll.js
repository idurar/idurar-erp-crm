const mongoose = require('mongoose');
const Admin = mongoose.model('Admin');

const listAll = async (req, res) => {
  const limit = parseInt(req.query.items) || 100;

  try {
    //  Query the database for a list of all results
    const result = await Admin.find({ removed: false })
      .limit(limit)
      .sort({ created: 'desc' })
      .populate();
    // Counting the total documents
    // Resolving both promises
    // Calculating total pages

    // Getting Pagination Object
    if (result.length > 0) {
      for (let admin of result) {
        admin.password = undefined;
        admin.loggedSessions = undefined;
      }
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
  } catch (error) {
    return res.status(500).json({ success: false, result: [], message: error.message, error });
  }
};

module.exports = listAll;
