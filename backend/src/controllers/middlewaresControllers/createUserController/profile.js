const mongoose = require('mongoose');

const profile = async (userModel, req, res) => {
  const User = mongoose.model(userModel);
  //  Query the database for a list of all results
  if (!req.admin) {
    return res.status(404).json({
      success: false,
      result: null,
      message: "couldn't found  admin Profile ",
    });
  }
  let result = {
    _id: req.admin._id,
    email: req.admin.email,
    name: req.admin.name,
    surname: req.admin.surname,
    photo: req.admin.photo,
    role: req.admin.role,
  };

  return res.status(200).json({
    success: true,
    result,
    message: 'Successfully found Profile',
  });
};
module.exports = profile;
