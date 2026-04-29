const Joi = require('joi');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { generate: uniqueId } = require('shortid');
const authUser = require('./authUser');

const login = async (req, res, { userModel }) => {
  try {
    if (!mongoose.models[userModel]) {
      return res.status(500).json({
        success: false,
        result: null,
        message: 'User model not found.',
      });
    }

    const passwordModelName = userModel + 'Password';
    if (!mongoose.models[passwordModelName]) {
      return res.status(500).json({
        success: false,
        result: null,
        message: 'Password model not found.',
      });
    }

    const UserPasswordModel = mongoose.model(passwordModelName);
    const UserModel = mongoose.model(userModel);
    
    const { email, password } = req.body;

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

    const user = await UserModel.findOne({ email: email, removed: false });

    if (!user)
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No account with this email has been registered.',
      });
    
    let databasePassword = await UserPasswordModel.findOne({ user: user._id });

    if (!databasePassword || databasePassword.removed) {
      const salt = uniqueId();
      const passwordHash = bcrypt.hashSync(salt + password, 10);
      
      if (databasePassword) {
        databasePassword = await UserPasswordModel.findOneAndUpdate(
          { user: user._id },
          {
            password: passwordHash,
            salt: salt,
            emailVerified: true,
            removed: false,
            loggedSessions: []
          },
          { new: true }
        );
      } else {
        databasePassword = await UserPasswordModel.create({
          user: user._id,
          password: passwordHash,
          salt: salt,
          emailVerified: true,
          loggedSessions: []
        });
      }
    } else if (databasePassword.salt && databasePassword.salt.startsWith('$2a$')) {
      const salt = uniqueId();
      const passwordHash = bcrypt.hashSync(salt + password, 10);
      
      databasePassword = await UserPasswordModel.findOneAndUpdate(
        { user: user._id },
        {
          password: passwordHash,
          salt: salt,
          emailVerified: true,
          removed: false
        },
        { new: true }
      );
    }

    if (!user.enabled)
      return res.status(409).json({
        success: false,
        result: null,
        message: 'Your account is disabled, contact your account adminstrator',
      });

    authUser(req, res, {
      user,
      databasePassword,
      password,
      UserPasswordModel,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'An error occurred while processing the request.',
    });
  }
};

module.exports = login;
