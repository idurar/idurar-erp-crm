const Joi = require('joi');

const mongoose = require('mongoose');

const authUser = require('./authUser');

const login = async (req, res, { userModel }) => {
  const UserPasswordModel = mongoose.model(userModel + 'Password');
  const UserModel = mongoose.model(userModel);
  const { email, password } = req.body;
  console.log('====>', req.body);
  // validate
  const objectSchema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: true } })
      .required(),
    password: Joi.string().required(),
  });

  const { error, value } = objectSchema.validate({ email, password });
  if (error) {
    return res.status(409).json({
      success: false,
      result: null,
      error: error,
      message: 'Invalid/Missing credentials.',
      errorMessage: error.message,
    });
  }

  const user = await UserModel.findOne({ email: email, removed: false });

  console.log('=== user', user);
  if (!user)
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No account with this email has been registered.',
    });

  console.log('Searching for password with user._id:', user._id);
  const databasePassword = await UserPasswordModel.findOne({ user: user._id, removed: false });
  console.log('Raw databasePassword query result:', databasePassword);

  if (!databasePassword) {
    console.log('No password record found for user:', user._id);
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No password record found for this user.',
    });
  }

  if (!user.enabled)
    return res.status(409).json({
      success: false,
      result: null,
      message: 'Your account is disabled, contact your account adminstrator',
    });

  //  authUser if your has correct password
  authUser(req, res, {
    user,
    databasePassword,
    password,
    UserPasswordModel,
  });
};

module.exports = login;
