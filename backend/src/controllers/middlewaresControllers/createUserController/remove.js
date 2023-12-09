const mongoose = require('mongoose');

const remove = async (userModel, req, res) => {
  const User = mongoose.model(userModel);

  let updates = {
    enabled: false,
  };

  // Find the document by id and delete it
  const user = await User.findOne({ _id: req.params.id, removed: false }).exec();

  if (user.role === 'admin' || user.role === 'superadmin') {
    return res.status(403).json({
      success: false,
      result: null,
      message: "can't remove a user with role 'admin'",
    });
  }
  // Find the document by id and delete it
  const result = await User.findOneAndUpdate(
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
      message: 'Successfully Deleted the document by id: ' + req.params.id,
    });
  }
};

module.exports = remove;
