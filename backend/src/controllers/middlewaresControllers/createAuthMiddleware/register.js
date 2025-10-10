const Joi = require('joi');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const register = async (req, res, { userModel }) => {
  const UserPasswordModel = mongoose.model(userModel + 'Password');
  const UserModel = mongoose.model(userModel);
  
  const { name, email, password, confirmPassword, country } = req.body;
  
  const objectSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email({ tlds: { allow: true } }).required(),
    password: Joi.string()
      .min(8)
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
      .required()
      .messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)',
        'string.min': 'Password must be at least 8 characters long'
      }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
      .messages({
        'any.only': 'Passwords do not match'
      }),
    country: Joi.string().required(),
  });
  
  const { error } = objectSchema.validate({ name, email, password, confirmPassword, country });
  
  if (error) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Invalid/Missing credentials.',
      errorMessage: error.message,
    });
  }
  
  const existingUser = await UserModel.findOne({ email: email.toLowerCase(), removed: false });
  
  if (existingUser) {
    return res.status(409).json({
      success: false,
      result: null,
      message: 'An account with this email already exists.',
    });
  }
  
  const user = await UserModel.create({
    name,
    email: email.toLowerCase(),
    country,
    enabled: true,
    removed: false,
  });
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  await UserPasswordModel.create({
    user: user._id,
    password: hashedPassword,
    removed: false,
  });
  
  return res.status(201).json({
    success: true,
    result: { _id: user._id, name: user.name, email: user.email, country: user.country },
    message: 'User registered successfully.',
  });
};

module.exports = register;