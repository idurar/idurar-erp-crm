const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const mongoose = require('mongoose');

const checkAndCorrectURL = require('./checkAndCorrectURL');
const sendMail = require('./sendMail');

const { loadSettings } = require('@/middlewares/settings');

const login = async (req, res, { userModel }) => {
  const UserPassword = mongoose.model(userModel + 'Password');
  const User = mongoose.model(userModel);
  const { email, password } = req.body;

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

  const user = await User.findOne({ email: email, removed: false });

  // console.log(user);
  if (!user)
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No account with this email has been registered.',
    });

  const userPassword = await UserPassword.findOne({ user: user._id, removed: false });

  const isMatch = await bcrypt.compare(userPassword.salt + password, userPassword.password);
  if (!isMatch)
    return res.status(403).json({
      success: false,
      result: null,
      message: 'Invalid credentials.',
    });

  if (!user.enabled) {
    const settings = await loadSettings();

    const idurar_app_email = settings['idurar_app_email'];
    const idurar_base_url = settings['idurar_base_url'];
    const url = checkAndCorrectURL(idurar_base_url);

    const link = url + '/verify/' + user._id + '/' + userPassword.emailToken;

    await sendMail({ email, name: user.name, link, idurar_app_email });

    return res.status(403).json({
      success: false,
      result: null,
      message: 'your email account is not verified , check your email inbox',
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: req.body.remember ? 365 * 24 + 'h' : '24h' }
  );

  await UserPassword.findOneAndUpdate(
    { user: user._id },
    { $push: { loggedSessions: token } },
    {
      new: true,
    }
  ).exec();

  res
    .status(200)
    .cookie('token', token, {
      maxAge: req.body.remember ? 365 * 24 * 60 * 60 * 1000 : null,
      sameSite: 'Lax',
      httpOnly: true,
      secure: false,
      domain: req.hostname,
      path: '/',
      Partitioned: true,
    })
    .json({
      success: true,
      result: {
        _id: user._id,
        name: user.name,
        surname: user.surname,
        role: user.role,
        email: user.email,
        photo: user.photo,
      },
      message: 'Successfully login user',
    });
};

module.exports = login;
