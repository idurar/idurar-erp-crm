const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const mongoose = require('mongoose');

const checkAndCorrectURL = require('./checkAndCorrectURL');
const sendMail = require('./sendMail');

const { loadSettings } = require('@/middlewares/settings');
const { useAppSettings } = require('@/settings');

const authUser = require('./authUser');
const reCaptcha = require('./reCaptcha')

const login = async (req, res, { userModel }) => {
  const UserPasswordModel = mongoose.model(userModel + 'Password');
  const UserModel = mongoose.model(userModel);

  const { loginData,recaptchaToken} = req.body;
  const {email,password} = loginData;

  // validate
  const objectSchema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: true } })
      .required(),
      password: Joi.string().required(),
      recaptchaToken : Joi.string().required()
      });

      const { error, value } = objectSchema.validate({ email, password,recaptchaToken });
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

  // console.log(user);
  if (!user)
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No account with this email has been registered.',
    });

  const databasePassword = await UserPasswordModel.findOne({ user: user._id, removed: false });

  if (!user.enabled)
    return res.status(409).json({
      success: false,
      result: null,
      message: 'Your account is disabled, contact your account adminstrator',
    });

        await reCaptcha(recaptchaToken);

  authUser(req, res, { user, databasePassword, password, UserPasswordModel });
};

module.exports = login;
