const mongoose = require('mongoose');

const update = async (userModel, req, res) => {
  const User = mongoose.model(userModel);

  let updates = {
    role: req.body.role,
    email: req.body.email,
    name: req.body.name,
    surname: req.body.surname,
    photo: req.body.photo,
    enabled: req.body.enabled,
  };

  // Find document by id and updates with the required fields
  const result = await User.findOneAndUpdate(
    { _id: req.params.id, removed: false },
    { $set: updates },
    {
      new: true, // return the new result instead of the old one
    }
  ).exec();

  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No document found by this id: ' + req.params.id,
    });
  }
  return res.status(200).json({
    success: true,
    result: {
      _id: result._id,
      enabled: result.enabled,
      email: result.email,
      name: result.name,
      surname: result.surname,
      photo: result.photo,
      role: result.role,
    },
    message: 'we update this document by this id: ' + req.params.id,
  });
};

module.exports = update;
