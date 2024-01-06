const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');
const shortid = require('shortid');
const sendIdurarOffer = require('./sendIdurarOffer');

const login = async (req, res, { userModel }) => {
  const UserPassword = mongoose.model(userModel + 'Password');
  const User = mongoose.model(userModel);
  const { userId, emailToken } = req.params;

  const userPasswordResult = await UserPassword.findOne({ user: userId, removed: false });

  if (!userPasswordResult)
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No account with this email has been registered.',
    });

  const isMatch = emailToken === userPasswordResult.emailToken;
  if (
    !isMatch ||
    userPasswordResult.emailToken === undefined ||
    userPasswordResult.emailToken === null
  )
    return res.status(403).json({
      success: false,
      result: null,
      message: 'Invalid verify token',
    });

  const token = jwt.sign(
    {
      id: userId,
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  await UserPassword.findOneAndUpdate(
    { user: userId },
    { $push: { loggedSessions: token }, emailToken: shortid.generate(), emailVerified: true },
    {
      new: true,
    }
  ).exec();

  const user = await User.findOneAndUpdate(
    { _id: userId },
    { enabled: true },
    {
      new: true,
    }
  ).exec();

  await sendIdurarOffer({
    email: user.email,
    name: user.name,
  });

  res
    .status(200)
    .cookie('token', token, {
      maxAge: 24 * 60 * 60 * 1000,
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
