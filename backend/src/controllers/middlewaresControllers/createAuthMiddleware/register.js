const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');
const shortid = require('shortid');

const { useAppSettings } = require('@/settings');
const checkAndCorrectURL = require('./checkAndCorrectURL');
const sendMail = require('./sendMail');

const register = async (req, res, { userModel }) => {
  const UserPassword = mongoose.model(userModel + 'Password');
  const User = mongoose.model(userModel);
  
  const { name, email, password, country } = req.body;

  // Input validation with strong password requirements
  const objectSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string()
      .email({ tlds: { allow: true } })
      .required(),
    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .required()
      .messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'
      }),
    country: Joi.string().required(),
  });

  const { error, value } = objectSchema.validate({ name, email, password, country });
  
  if (error) {
    return res.status(400).json({
      success: false,
      result: null,
      error: error,
      message: 'Invalid registration data',
      errorMessage: error.message,
    });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase(), removed: false });
  
  if (existingUser) {
    return res.status(409).json({
      success: false,
      result: null,
      message: 'An account with this email already exists.',
    });
  }

  // Create password using existing model methods
  const salt = shortid.generate();
  const emailToken = shortid.generate();

  try {
    // Create new user
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      country,
      enabled: false, // Account needs email verification
      removed: false,
    });

    const savedUser = await newUser.save();

    // Create password record using existing model
    const newUserPassword = new UserPassword({
      user: savedUser._id,
      salt: salt,
      emailToken: emailToken,
      emailVerified: false,
      loggedSessions: [],
      authType: 'email',
    });

    // Use the existing generateHash method
    newUserPassword.password = newUserPassword.generateHash(salt, password);

    await newUserPassword.save();

    // Send verification email
    const settings = useAppSettings();
    const idurar_app_email = settings['idurar_app_email'];
    const idurar_base_url = settings['idurar_base_url'];

    const url = checkAndCorrectURL(idurar_base_url);
    const link = url + '/verify/' + savedUser._id + '/' + emailToken;

    await sendMail({
      email: savedUser.email,
      name: savedUser.name,
      link,
      subject: 'Verify your email | idurar',
      idurar_app_email,
      type: 'emailVerfication',
    });

    return res.status(201).json({
      success: true,
      result: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        country: savedUser.country,
      },
      message: 'Account created successfully! Please check your email to verify your account.',
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Registration failed. Please try again.',
      error: error.message,
    });
  }
};

module.exports = register;