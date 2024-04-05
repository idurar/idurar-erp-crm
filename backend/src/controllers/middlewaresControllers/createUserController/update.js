const mongoose = require('mongoose');

const update = async (userModel, req, res) => {
  const User = mongoose.model(userModel);
  const reqUserName = userModel.toLowerCase();
  let { email, enabled, name, photo, surname, role } = req.body;

  if (role === 'owner' && req[reqUserName].role !== 'owner') {
    return res.status(403).send({
      success: false,
      result: null,
      message: "you can't update user with role owner",
    });
  }

  const tmpResult = await User.findOne({
    _id: req.params.id,
    removed: false,
  }).exec();

  if (
    role === 'owner' &&
    req[reqUserName].role === 'owner' &&
    tmpResult._id.toString() !== req[reqUserName]._id.toString()
  ) {
    return res.status(403).send({
      success: false,
      result: null,
      message: "you can't update other users with role owner",
    });
  }

  let updates = {};

  if (
    req[reqUserName].role === 'owner' &&
    tmpResult._id.toString() === req[reqUserName]._id.toString()
  ) {
    updates = { email, photo, name, surname };
  } else if (
    req[reqUserName].role === 'admin' &&
    tmpResult._id.toString() === req[reqUserName]._id.toString()
  ) {
    updates = { email, photo, name, surname };
  } else {
    updates = { role, email, photo, enabled, name, surname };
  }

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
      message: 'No document found ',
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
    message: 'we update this document ',
  });
};

module.exports = update;
