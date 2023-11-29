const { migrate } = require('./migrate');

const mongoose = require('mongoose');

const Model = mongoose.model('Client');

const listAll = async (req, res) => {
  const sort = parseInt(req.query.sort) || 'desc';

  //  Query the database for a list of all results
  const result = await Model.find({ removed: false }).sort({ created: sort }).populate().exec();

  const migratedData = result.map((x) => migrate(x));
  if (result.length > 0) {
    return res.status(200).json({
      success: true,
      result: migratedData,
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
