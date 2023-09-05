const mongoose = require('mongoose');
const Admin = mongoose.model('Admin');

const photo = async (req, res) => {
  try {
    // Find document by id
    const updates = {
      photo: req.body.photo,
    };

    const tmpResult = await Admin.findOneAndUpdate(
      { _id: req.admin._id, removed: false },
      { $set: updates },
      { new: true, runValidators: true, context: 'query' }
    );
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
  } catch {
    // Server Error
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Oops there is an Error',
    });
  }
};
module.exports = photo;
