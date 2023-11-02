const mongoose = require('mongoose');
const Admin = mongoose.model('Admin');

const read = async (req, res) => {
  try {
    // Find document by id
    const tmpResult = await Admin.findOne({
      _id: req.params.id,
      removed: false,
    });
    // If no results found, return document not found
    if (!tmpResult) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found by this id: ' + req.params.id,
      });
    } else {
      // Return success resposne
      let result = {
        _id: tmpResult._id,
        enabled: tmpResult.enabled,
        email: tmpResult.email,
        name: tmpResult.name,
        surname: tmpResult.surname,
        photo: tmpResult.photo,
        role: tmpResult.role,
      };

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
      error,
    });
  }
};

module.exports = read;
