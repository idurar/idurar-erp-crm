const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const mongoose = require('mongoose');

const checkAndCorrectURL = require('./checkAndCorrectURL');
const sendMail = require('./sendMail');

const { loadSettings } = require('@/middlewares/settings');
const { useAppSettings } = require('@/settings');

const register = async (req, res, { userModel }) => {
  const UserPasswordModel = mongoose.model(userModel + 'Password');
  const UserModel = mongoose.model(userModel);
  const { name, email, password, country } = req.body;

  // validate
  const objectSchema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: true } })
      .required(),
    name: Joi.string().required(),
    country: Joi.string().required(),
    password: Joi.string().required(),
  });

  const { error, value } = objectSchema.validate({ name, email, password, country });
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
  if (user)
    return res.status(409).json({
      success: false,
      result: null,
      message: 'An account with this email already exists.',
    });

  //  authUser if your has correct password
  const salt = await bcrypt.genSalt(10);
  console.log(salt)
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = {
    name: name,
    email: email,
    country: country,
    enabled: true,
  };

  const createdUser = await UserModel.create(newUser);
  const newUserPassword = {
    removed: false,
    user: createdUser,
    password: hashedPassword,
    salt: salt,
    emailVerified: false,
    authType: "email",
    loggedSessions: []
  }
  const databasePassword = await UserPasswordModel.create(newUserPassword);
  if (!createdUser || !databasePassword) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Error creating your account.',
    });
  } else {
    const success = {
      success: true
    }
    const newUser = {...createdUser, ...success}
    return res.status(200).json(newUser);
  }
};

module.exports = register;
