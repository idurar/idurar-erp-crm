const Joi = require('joi');
const mongoose = require('mongoose');
const authUser = require('./authUser');

const login = async (req, res, { userModel }) => {
  try {
    const UserPasswordModel = mongoose.model(userModel + 'Password');
    const UserModel = mongoose.model(userModel);
    const { email, password } = req.body;

    // Validate input
    const schema = Joi.object({
      email: Joi.string().email({ tlds: { allow: true } }).required(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate({ email, password });
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or missing credentials',
        errorMessage: error.message,
      });
    }

    // Find user
    const user = await UserModel.findOne({ email: email, removed: false });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account with this email has been registered',
      });
    }

    if (!user.enabled) {
      return res.status(403).json({
        success: false,
        message: 'Your account is disabled, contact your administrator',
      });
    }

    const databasePassword = await UserPasswordModel.findOne({
      user: user._id,
      removed: false,
    });

    // Authenticate user
    authUser(req, res, {
      user,
      databasePassword,
      password,
      UserPasswordModel,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message,
    });
  }
};

module.exports = login;
