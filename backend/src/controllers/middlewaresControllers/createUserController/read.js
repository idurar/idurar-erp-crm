const mongoose = require('mongoose');

const read = async (userModel, req, res) => {
  const User = mongoose.model(userModel);

  const reqUserName = userModel.toLowerCase();
  const userProfile = req[reqUserName];

  if (userProfile._id.toString() !== req.params.id) {
    return res.status(403).json({
      success: false,
      result: null,
      message: 'Unauthorized: You can only read your own profile.',
    });
  }

  // Find document by id
  const tmpResult = await User.findOne({
    _id: req.params.id,
    removed: false,
  }).exec();
  // If no results found, return document not found
  if (!tmpResult) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No document found ',
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
      message: 'we found this document ',
    });
  }
};

module.exports = read;
