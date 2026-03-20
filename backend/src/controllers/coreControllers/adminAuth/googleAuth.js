const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const verifyGoogleToken = require('@/utils/verifyGoogleToken');

/**
 * Controller: googleAuth
 * Receives { token } in body (Google ID token), verifies it, finds or creates Admin user,
 * issues JWT and returns user object similar to regular login.
 */
module.exports = async function googleAuth(req, res) {
  try {
    const { token: idToken, remember } = req.body;

    if (!idToken) {
      return res.status(400).json({ success: false, result: null, message: 'Missing ID token.' });
    }

    // Verify the Google ID token and extract basic profile
    const payload = await verifyGoogleToken(idToken);

    const { name, email, picture, email_verified } = payload;

    if (!email) {
      return res.status(400).json({ success: false, result: null, message: 'Google account does not provide an email.' });
    }

    const AdminModel = mongoose.model('Admin');
    const AdminPasswordModel = mongoose.model('AdminPassword');

    // Try to find existing user by email
    let user = await AdminModel.findOne({ email: email.toLowerCase(), removed: false });

    // If user does not exist, create one (Google users are enabled by default)
    if (!user) {
      const [firstName, ...rest] = (name || '').split(' ');
      const surname = rest.join(' ');

      user = await AdminModel.create({
        email: email.toLowerCase(),
        name: firstName || email,
        surname: surname || '',
        photo: picture || null,
        isGoogleUser: true,
        enabled: true,
      });
    }

    if (!user.enabled) {
      return res.status(409).json({ success: false, result: null, message: 'Your account is disabled, contact your account administrator' });
    }

    // Issue JWT token
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: remember ? 365 * 24 + 'h' : '24h' });

    // Ensure there's an AdminPassword document to store loggedSessions. If none, create one with random password/salt and authType 'google'
    let userPassword = await AdminPasswordModel.findOne({ user: user._id, removed: false });
    if (!userPassword) {
      const randomPassword = crypto.randomBytes(16).toString('hex');
      const salt = crypto.randomBytes(8).toString('hex');
      const hashed = bcrypt.hashSync(salt + randomPassword);

      userPassword = await AdminPasswordModel.create({
        user: user._id,
        password: hashed,
        salt,
        authType: 'google',
        emailVerified: !!email_verified,
        loggedSessions: [jwtToken],
      });
    } else {
      // push token into loggedSessions
      await AdminPasswordModel.findOneAndUpdate(
        { user: user._id },
        { $push: { loggedSessions: jwtToken }, $set: { authType: userPassword.authType || 'google' } },
        { new: true }
      ).exec();
    }

    // Return response matching existing login shape
    return res.status(200).json({
      success: true,
      result: {
        _id: user._id,
        name: user.name,
        surname: user.surname,
        role: user.role,
        email: user.email,
        photo: user.photo,
        token: jwtToken,
        maxAge: remember ? 365 : null,
      },
      message: 'Successfully logged in with Google',
    });
  } catch (err) {
    // If verifyGoogleToken throws, err.message will be 'Invalid Google ID token'
    const msg = err.message || 'Google authentication failed';
    return res.status(401).json({ success: false, result: null, message: msg });
  }
};
