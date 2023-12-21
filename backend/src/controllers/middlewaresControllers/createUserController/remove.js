const mongoose = require('mongoose');

const remove = async (userModel, req, res) => {
  const User = mongoose.model(userModel);

  // Find the document by id and delete it
  const user = await User.findOne({ _id: req.params.id, removed: false }).exec();

  if (user.role === 'admin' || user.role === 'superadmin') {
    return res.status(403).json({
      success: false,
      result: null,
      message: "can't remove a user with role 'admin'",
    });
  }

  const result = await User.deleteOne({ _id: req.params.id }).exec();
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
      message: 'Successfully Deleted permantely the document by id: ' + req.params.id,
    });
  }
};

module.exports = remove;
