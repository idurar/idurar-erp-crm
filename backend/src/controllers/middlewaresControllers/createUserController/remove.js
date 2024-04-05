const mongoose = require('mongoose');
const { generate: uniqueId } = require('shortid');

const remove = async (userModel, req, res) => {
  const User = mongoose.model(userModel);
  const reqUserName = userModel.toLowerCase();

  // Find the document by id and delete it
  const user = await User.findOne({
    _id: req.params.id,

    removed: false,
  }).exec();

  if (user.role === 'owner') {
    return res.status(403).json({
      success: false,
      result: null,
      message: "can't remove a user with role 'owner'",
    });
  }

  let updates = {
    removed: true,
    email: 'removed+' + uniqueId() + '+' + user.email,
  };
  // Find the document by id and delete it
  const result = await User.findOneAndUpdate(
    { _id: req.params.id },
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
      message: 'No document found ',
    });
  } else {
    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully Deleted permantely the document ',
    });
  }
};

module.exports = remove;
