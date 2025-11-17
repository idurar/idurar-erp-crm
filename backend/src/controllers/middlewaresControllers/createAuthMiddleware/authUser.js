const bcrypt = require('bcryptjs');
const { generateAccessToken, generateRefreshToken } = require('./generateTokens');

const authUser = async (req, res, { user, databasePassword, password, UserPasswordModel }) => {
  const isMatch = await bcrypt.compare(databasePassword.salt + password, databasePassword.password);

  if (!isMatch)
    return res.status(403).json({ success: false, result: null, message: 'Invalid credentials.' });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  await UserPasswordModel.findOneAndUpdate(
    { user: user._id },
    { $push: { loggedSessions: refreshToken } },
    { new: true }
  ).exec();

  return res.status(200).json({
    success: true,
    result: {
      _id: user._id,
      name: user.name,
      surname: user.surname,
      role: user.role,
      email: user.email,
      photo: user.photo,
      accessToken,
      refreshToken,
    },
    message: 'Successfully login user',
  });
};

module.exports = authUser;
