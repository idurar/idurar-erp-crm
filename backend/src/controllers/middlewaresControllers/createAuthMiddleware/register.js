const bcrypt = require('bcryptjs');
const Joi = require('joi');
const mongoose = require('mongoose');
const { generate: uniqueId } = require('shortid');
const { loadSettings } = require('@/middlewares/settings');

const checkAndCorrectURL = require('./checkAndCorrectURL');
const sendMail = require('./sendMail');

const register = async (req, res, { userModel }) => {
  const settings = await loadSettings();

  const idurar_registration_allowed = settings['idurar_registration_allowed'];

  const idurar_app_email = settings['idurar_app_email'];
  const idurar_base_url = settings['idurar_base_url'];

  if (!idurar_registration_allowed) {
    return res.status(409).json({
      success: false,
      result: null,
      message: 'Registration is not allowed , please contact application administrator',
    });
  }

  const UserPassword = mongoose.model(userModel + 'Password');
  const User = mongoose.model(userModel);
  const { name, email, password } = req.body;

  // validate
  const objectSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string()
      .email({ tlds: { allow: true } })
      .required(),
    password: Joi.string().required(),
  });

  const { error, value } = objectSchema.validate({ name, email, password });
  if (error) {
    return res.status(409).json({
      success: false,
      result: null,
      error: error,
      message: 'Invalid/Missing credentials.',
      errorMessage: error.message,
    });
  }

  const existingUser = await User.findOne({ email: email, removed: false });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      result: null,
      message: 'An account with this email has already been registered.',
    });
  }

  const salt = uniqueId();
  const hashedPassword = bcrypt.hashSync(salt + password);
  const emailToken = uniqueId();

  const savedUser = await User.create({ email, name });

  const registrationDone = await UserPassword.create({
    user: savedUser._id,
    password: hashedPassword,
    salt: salt,
    emailToken,
  });

  if (!registrationDone) {
    await User.deleteOne({ _id: savedUser._id }).exec();

    return res.status(403).json({
      success: false,
      result: null,
      message: "document couldn't save correctly",
    });
  }

  const url = checkAndCorrectURL(idurar_base_url);

  const link = url + '/verify/' + savedUser._id + '/' + emailToken;

  await sendMail({ email, name, link, idurar_app_email });
  // Email verification logic here

  return res.status(200).json({
    success: true,
    result: {
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
    },
    message: 'Account registered successfully. Please verify your email.',
  });
};

module.exports = register;
