const Joi = require('joi');

const mongoose = require('mongoose');

const checkAndCorrectURL = require('./checkAndCorrectURL');
const sendMail = require('./sendMail');
const shortid = require('shortid');
const { loadSettings } = require('@/middlewares/settings');

const { useAppSettings } = require('@/settings');

const forgetPassword = async (req, res, { userModel }) => {
  const UserPassword = mongoose.model(userModel + 'Password');
  const User = mongoose.model(userModel);
  const { email } = req.body;

  // validate
  const objectSchema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: true } })
      .required(),
  });

  const { error, value } = objectSchema.validate({ email });
  if (error) {
    return res.status(409).json({
      success: false,
      result: null,
      error: error,
      message: 'Invalid email.',
      errorMessage: error.message,
    });
  }

  const user = await User.findOne({ email: email, removed: false });
  const databasePassword = await UserPassword.findOne({ user: user._id, removed: false });

  // console.log(user);
  if (!user)
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No account with this email has been registered.',
    });

  const resetToken = shortid.generate();
  await UserPassword.findOneAndUpdate(
    { user: user._id },
    { resetToken },
    {
      new: true,
    }
  ).exec();

  const settings = useAppSettings();
  const idurar_app_email = settings['idurar_app_email'];
  const idurar_base_url = settings['idurar_base_url'];

  const url = checkAndCorrectURL(idurar_base_url);

  const link = url + '/resetpassword/' + user._id + '/' + resetToken;

  await sendMail({
    email,
    name: user.name,
    link,
    subject: 'Reset your password | idurar',
    idurar_app_email,
    type: 'passwordVerfication',
  });

  return res.status(200).json({
    success: true,
    result: null,
    message: 'Check your email inbox , to reset your password',
  });
};

module.exports = forgetPassword;
