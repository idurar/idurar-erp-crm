const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { verifyGoogleToken } = require('@/utils/googleVerify');

const googleAuth = async (req, res, { userModel }) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Token is required',
      });
    }

    const payload = await verifyGoogleToken(token);

    if (!payload.email_verified) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Email not verified by Google',
      });
    }

    const UserModel = mongoose.model(userModel);
    const UserPasswordModel = mongoose.model(userModel + 'Password');

    let user = await UserModel.findOne({ email: payload.email, removed: false });

    if (!user) {
      user = new UserModel({
        email: payload.email,
        name: payload.name,
        photo: payload.picture,
        enabled: true,
        role: 'owner',
      });
      await user.save();

      const userPassword = new UserPasswordModel({
        user: user._id,
        salt: payload.sub,
        password: payload.sub,
        emailVerified: true,
        authType: 'google',
      });
      await userPassword.save();
    } else {
      if (!user.enabled) {
        return res.status(409).json({
          success: false,
          result: null,
          message: 'Your account is disabled, contact your account administrator',
        });
      }

      const userPassword = await UserPasswordModel.findOne({ user: user._id, removed: false });
      if (userPassword && !userPassword.emailVerified) {
        await UserPasswordModel.findOneAndUpdate(
          { user: user._id },
          { emailVerified: true, authType: 'google' },
          { new: true }
        );
      }
    }

    const jwtToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const userPassword = await UserPasswordModel.findOne({ user: user._id });
    await UserPasswordModel.findOneAndUpdate(
      { user: user._id },
      { $push: { loggedSessions: jwtToken } },
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
        token: jwtToken,
      },
      message: 'Successfully logged in with Google',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

module.exports = googleAuth;
