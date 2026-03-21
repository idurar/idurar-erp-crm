const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authUser = require('./authUser');

const register = async (req, res, next, { userModel }) => {
  try {
    const UserModel = mongoose.model(userModel);
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await UserModel.create({ name, email, password: hashedPassword });

    // Generate token (optional)
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: { id: newUser._id, name: newUser.name, email: newUser.email },
        token,
      },
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ success: false, message: 'Registration failed', error });
  }
};

module.exports = register;
