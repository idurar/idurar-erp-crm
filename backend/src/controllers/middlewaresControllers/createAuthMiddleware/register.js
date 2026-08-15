const Joi = require('joi');
const { generate: uniqueId } = require('shortid');
const mongoose = require('mongoose');

const register = async (req, res, { userModel }) => {
  const UserPasswordModel = mongoose.model(userModel + 'Password');
  const UserModel = mongoose.model(userModel);
  
  const { email, password, name, country } = req.body;

  // Validate input
  const objectSchema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: true } })
      .required(),
    password: Joi.string().required(),
    name: Joi.string().required(),
    country: Joi.string().optional(),
  });

  const { error, value } = objectSchema.validate({ email, password, name, country });
  
  if (error) {
    return res.status(409).json({
      success: false,
      result: null,
      error: error,
      message: 'Invalid/Missing credentials.',
      errorMessage: error.message,
    });
  }

  // Check if user already exists
  const existingUser = await UserModel.findOne({ email: email, removed: false });
  
  if (existingUser) {
    return res.status(409).json({
      success: false,
      result: null,
      message: 'An account with this email already exists.',
    });
  }

  try {
    // Create new user
    const newUser = {
      email,
      name,
      country: country || '',
      role: 'owner',
      enabled: true,
    };
    
    const user = await new UserModel(newUser).save();

    // Create password
    const newUserPassword = new UserPasswordModel();
    const salt = uniqueId();
    const passwordHash = newUserPassword.generateHash(salt, password);

    const userPasswordData = {
      password: passwordHash,
      emailVerified: false,
      salt: salt,
      user: user._id,
    };
    
    await new UserPasswordModel(userPasswordData).save();

    return res.status(200).json({
      success: true,
      result: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      message: 'Account created successfully. Please login with your credentials.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Error creating account.',
      error: error.message,
    });
  }
};

module.exports = register;

