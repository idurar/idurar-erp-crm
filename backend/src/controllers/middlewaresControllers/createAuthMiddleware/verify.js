const mongoose = require('mongoose');

/**
 * Verify email token handler
 * URL: GET /api/verify/:userId/:emailToken
 * Marks the related UserPassword.emailVerified = true if token matches
 * Supports an optional third parameter: options = { userModel }
 */
const verify = async (req, res, options = {}) => {
  const { userId, emailToken } = req.params;
  const userModel = options.userModel || 'Admin';

  // Helper to decide if caller is a browser navigation (Accepts HTML)
  const isBrowser = () => {
    const accept = (req.headers && req.headers.accept) || '';
    return accept.includes('text/html') || accept.includes('application/xhtml+xml');
  };

  if (!userId || !emailToken) {
    if (isBrowser()) return res.redirect(`${process.env.CLIENT_BASE_URL || 'http://localhost:3000'}/?verified=0&error=missing_params`);
    return res.status(400).json({ success: false, result: null, message: 'Missing parameters' });
  }

  const UserPassword = mongoose.model(userModel + 'Password');
  const User = mongoose.model(userModel);

  const user = await User.findOne({ _id: userId, removed: false });

  if (!user) {
    if (isBrowser()) return res.redirect(`${process.env.CLIENT_BASE_URL || 'http://localhost:3000'}/?verified=0&error=user_not_found`);
    return res.status(404).json({ success: false, result: null, message: 'User not found' });
  }

  const databasePassword = await UserPassword.findOne({ user: user._id, removed: false });

  if (!databasePassword) {
    if (isBrowser()) return res.redirect(`${process.env.CLIENT_BASE_URL || 'http://localhost:3000'}/?verified=0&error=verification_data_not_found`);
    return res.status(404).json({ success: false, result: null, message: 'Verification data not found' });
  }

  if (!databasePassword.emailToken || databasePassword.emailToken !== emailToken) {
    if (isBrowser()) return res.redirect(`${process.env.CLIENT_BASE_URL || 'http://localhost:3000'}/?verified=0&error=invalid_token`);
    return res.status(409).json({ success: false, result: null, message: 'Invalid or expired verification token' });
  }

  databasePassword.emailVerified = true;
  databasePassword.emailToken = undefined;
  await databasePassword.save();

  // return user data (without sensitive fields)
  const result = {
    _id: user._id,
    name: user.name,
    email: user.email,
  };

  if (isBrowser()) return res.redirect(`${process.env.CLIENT_BASE_URL || 'http://localhost:3000'}/?verified=1`);

  return res.status(200).json({ success: true, result, message: 'Email verification successful' });
};

module.exports = verify;
