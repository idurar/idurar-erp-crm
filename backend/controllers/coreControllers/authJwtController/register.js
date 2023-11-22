const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');

const Admin = mongoose.model('Admin');

const register = async (req, res) => {
  const clientIP = req.connection.remoteAddress;
  let isLocalhost = false;
  if (clientIP === '127.0.0.1' || clientIP === '::1') {
    // Connection is from localhost
    isLocalhost = true;
  }

  try {
    const { company, email, password, name, BankAccount, companyRegNumber } = req.body;

    if (!company || !email || !password || !name || !BankAccount || !companyRegNumber) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Please provide all required fields.',
      });
    }

    const existingUser = await Admin.findOne({ email, removed: false });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'An account with this email already exists.',
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new Admin({
      company,
      name,
      BankAccount,
      companyRegNumber,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    const admin = await Admin.findOne({ email: email, removed: false });

    const token = jwt.sign(
      {
        id: admin._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: req.body.remember ? 365 * 24 + 'h' : '24h' }
    );

    const result = await Admin.findOneAndUpdate(
      { _id: admin._id },
      { $set: { isLoggedIn: 1 }, $push: { loggedSessions: token } },
      {
        new: true,
      }
    ).exec();

    res
      .status(200)
      .cookie('token', token, {
        maxAge: req.body.remember ? 365 * 24 * 60 * 60 * 1000 : null, // Cookie expires after 30 days
        sameSite: process.env.NODE_ENV === 'production' && !isLocalhost ? 'Lax' : 'none',
        httpOnly: true,
        secure: true,
        domain: req.hostname,
        Path: '/',
      })
      .json({
        success: true,
        result: {
          token,
          admin: {
            id: result._id,
            name: result.name,
            isLoggedIn: result.isLoggedIn > 0 ? true : false,
          },
        },
        message: 'Successfully created new admin user',
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      result: null,
      message: 'Registration failed. Please try again later.',
      error: error.message,
    });
  }
};

module.exports = register;
