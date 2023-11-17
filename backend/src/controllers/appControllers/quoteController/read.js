const mongoose = require('mongoose');

const Model = mongoose.model('Quote');

const read = async (req, res) => {
  try {
    // Find document by id
    const result = await Model.findOne({ _id: req.params.id, removed: false }).populate(
      'createdBy',
      'name'
    );
    // If no results found, return document not found
    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found by this id: ' + req.params.id,
      });
    } else {
      // Return success resposne
      return res.status(200).json({
        success: true,
        result,
        message: 'we found this document by this id: ' + req.params.id,
      });
    }
  } catch (error) {
    // Server Error
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
      error: error,
    });
  }
};

module.exports = read;
