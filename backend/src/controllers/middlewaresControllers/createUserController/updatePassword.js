const mongoose = require('mongoose');

const { generate: uniqueId } = require('shortid');

const updatePassword = async (userModel, req, res) => {
  const UserPassword = mongoose.model(userModel + 'Password');

  const reqUserName = userModel.toLowerCase();
  const userProfile = req[reqUserName];
  let { password } = req.body;

  if (password.length < 8)
    return res.status(400).json({
      msg: 'The password needs to be at least 8 characters long.',
    });

  // Find document by id and updates with the required fields

  var newUserPassword = new UserPassword();

  const salt = uniqueId();

  const passwordHash = newUserPassword.generateHash(salt, password);

  const UserPasswordData = {
    password: passwordHash,
    salt: salt,
  };

  const resultPassword = await UserPassword.findOneAndUpdate(
    { user: userProfile._id, removed: false },
    { $set: UserPasswordData },
    {
      new: true, // return the new result instead of the old one
    }
  ).exec();

  if (!resultPassword) {
    return res.status(403).json({
      success: false,
      result: null,
      message: "User Password couldn't save correctly",
    });
  }

  return res.status(200).json({
    success: true,
    result: {},
    message: 'we update the password by this id: ' + userProfile._id,
  });
};

module.exports = updatePassword;
