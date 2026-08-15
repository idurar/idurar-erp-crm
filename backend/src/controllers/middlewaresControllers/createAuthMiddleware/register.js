const { generate: uniqueId } = require('shortid');

// 🔥 Strong password validation regex
// Requirements: min 8 chars, uppercase, lowercase, number, special char
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

const register = async (req, res, { userModel }) => {
  try {
    const { name, email, password, country } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Name, email, and password are required',
      });
    }

    // 🔥 BACKEND PASSWORD VALIDATION - Enforce strong passwords
    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Password is too weak. Password must be at least 8 characters and include uppercase, lowercase, number and special character.',
      });
    }

    // Check if user already exists
    const UserPassword = require('@/models/coreModels/AdminPassword');
    const existingUser = await userModel.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        result: null,
        message: 'An account with this email already exists.',
      });
    }

    // Create new user
    const newUser = new userModel({
      name,
      email,
      enabled: false, // Email verification required
      country,
    });

    const savedUser = await newUser.save();

    // Create password record with salt
    const newUserPassword = new UserPassword();
    const salt = uniqueId();
    const passwordHash = newUserPassword.generateHash(salt, password);

    const userPasswordData = {
      password: passwordHash,
      salt: salt,
      user: savedUser._id,
      emailVerified: false,
    };

    await new UserPassword(userPasswordData).save();

    return res.status(200).json({
      success: true,
      result: {
        _id: savedUser._id,
        email: savedUser.email,
        name: savedUser.name,
      },
      message: 'Successfully registered. Please check your email to verify your account.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'An error occurred during registration',
      error: error.message,
    });
  }
};

module.exports = register;
