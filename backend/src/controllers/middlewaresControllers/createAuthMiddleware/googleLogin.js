const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const shortid = require('shortid');
const bcrypt = require('bcryptjs');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res, { userModel }) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Google token required',
      });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Models
    const User = mongoose.model(userModel);
    const UserPassword = mongoose.model(userModel + 'Password');

    // Check if user exists
    let user = await User.findOne({ email, removed: false });
    let isNewUser = false;

    if (!user) {
      // Create new user
      user = new User({
        googleId,
        email,
        name,
        photo: picture,
        removed: false,
      });
      await user.save();

      // Generate a random salt + bcrypt hash for placeholder password
      const salt = await bcrypt.genSalt(10);
      const randomPassword = shortid.generate(); // placeholder password
      const pass = "bitto"
      const hashedPassword = await bcrypt.hash(salt + pass, 10);

      await UserPassword.create({
        user: user._id,
        password: hashedPassword,
        salt: salt,
        loggedSessions: [],
        removed: false,
        resetToken: shortid.generate(),
        emailVerified: true,
        authType: 'google',
      });

      isNewUser = true;
    }

    // Issue JWT
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Save token in loggedSessions
    await UserPassword.updateOne(
      { user: user._id },
      { $addToSet: { loggedSessions: accessToken } }
    );

    return res.status(200).json({
      success: true,
      newUser: isNewUser,
      message: isNewUser
        ? 'Account created with Google. Contact admin to set/change password if needed.'
        : 'Login successful',
      result: {
        token: accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          photo: user.photo,
        },
      },
    });
  } catch (error) {
    console.error('Google login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Google login failed',
      error: error.message,
    });
  }
};

module.exports = googleLogin;
