const mongoose = require('mongoose');
const { generate: uniqueId } = require('shortid');

const create = async (userModel, req, res) => {
  const User = mongoose.model(userModel);
  const UserPassword = mongoose.model(userModel + 'Password');
  let { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({
      success: false,
      result: null,
      message: "Email or password fields they don't have been entered.",
    });

  const existingUser = await User.findOne({ email: email });

  if (existingUser)
    return res.status(400).json({
      success: false,
      result: null,
      message: 'An account with this email already exists.',
    });

  if (password.length < 8)
    return res.status(400).json({
      success: false,
      result: null,
      message: 'The password needs to be at least 8 characters long.',
    });

  var newUserPassword = new UserPassword();

  const salt = uniqueId();

  const passwordHash = newUserPassword.generateHash(salt, password);

  req.body.password = undefined;
  req.body.removed = false;
  req.body.enabled = true;
  const result = await new User(req.body).save();

  if (!result) {
    return res.status(403).json({
      success: false,
      result: null,
      message: "document couldn't save correctly",
    });
  }
  const UserPasswordData = {
    password: passwordHash,
    salt: salt,
    user: result._id,
    emailVerified: true,
  };
  const resultPassword = await new UserPassword(UserPasswordData).save();

  if (!resultPassword) {
    await User.deleteOne({ _id: result._id }).exec();

    return res.status(403).json({
      success: false,
      result: null,
      message: "document couldn't save correctly",
    });
  }

  return res.status(200).send({
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
    message: 'User document save correctly',
  });
};
module.exports = create;
