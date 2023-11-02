const mongoose = require('mongoose');
const Admin = mongoose.model('Admin');

const status = async (req, res) => {
  try {
    if (req.query.enabled === true || req.query.enabled === false) {
      let updates = {
        enabled: req.query.enabled,
      };
      // Find the document by id and delete it
      const result = await Admin.findOneAndUpdate(
        { _id: req.params.id, removed: false },
        { $set: updates },
        {
          new: true, // return the new result instead of the old one
        }
      ).exec();
      // If no results found, return document not found
      if (!result) {
        return res.status(404).json({
          success: false,
          result: null,
          message: 'No document found by this id: ' + req.params.id,
        });
      } else {
        return res.status(200).json({
          success: true,
          result,
          message: 'Successfully update status of this document by id: ' + req.params.id,
        });
      }
    } else {
      return res
        .status(202)
        .json({
          success: false,
          result: [],
          message: "couldn't change admin status by this request",
        })
        .end();
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
    });
  }
};
module.exports = status;
