const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { stubFalse } = require('lodash');

const mongoose = require('mongoose');

const Admin = mongoose.model('Admin');

require('dotenv').config({ path: '.variables.env' });

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate
    if (!email || !password)
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Not all fields have been entered.',
      });

    const admin = await Admin.findOne({ email: email, removed: false });
    // console.log(admin);
    if (!admin)
      return res.status(400).json({
        success: false,
        result: null,
        message: 'No account with this email has been registered.',
      });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Invalid credentials.',
      });

    const token = jwt.sign(
      {
        id: admin._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: req.body.remember ? 365 * 24 + 'h' : '24h' }
    );

    const result = await Admin.findOneAndUpdate(
      { _id: admin._id },
      { isLoggedIn: true },
      {
        new: true,
      }
    ).exec();

    res
      .status(200)
      .cookie('token', token, {
        maxAge: req.body.remember ? 365 * 24 * 60 * 60 * 1000 : null, // Cookie expires after 30 days
        sameSite: 'Lax',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' ? true : false,
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
            isLoggedIn: result.isLoggedIn,
          },
        },
        message: 'Successfully login admin',
      });
  } catch (err) {
    res.status(500).json({ success: false, result: null, message: err.message, error: err });
  }
};

exports.isValidAdminToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token)
      return res.status(401).json({
        success: false,
        result: null,
        message: 'No authentication token, authorization denied.',
        jwtExpired: true,
      });

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    if (!verified)
      return res.status(401).json({
        success: false,
        result: null,
        message: 'Token verification failed, authorization denied.',
        jwtExpired: true,
      });

    const admin = await Admin.findOne({ _id: verified.id, removed: false });
    if (!admin)
      return res.status(401).json({
        success: false,
        result: null,
        message: "Admin doens't Exist, authorization denied.",
        jwtExpired: true,
      });
    // if (admin.isLoggedIn === false)
    //   return res.status(401).json({
    //     success: false,
    //     result: null,
    //     message: 'Admin is already logout try to login, authorization denied.',
    //     jwtExpired: true,
    //   });
    else {
      req.admin = admin;
      next();
    }
  } catch (err) {
    res.status(503).json({
      success: false,
      result: null,
      message: err.message,
      error: err,
    });
  }
};

exports.logout = async (req, res) => {
  // const result = await Admin.findOneAndUpdate(
  //   { _id: req.admin._id },
  //   { isLoggedIn: false },
  //   {
  //     new: true,
  //   }
  // ).exec();

  res
    .clearCookie('token', {
      maxAge: null, // Cookie expires after 30 days
      sameSite: 'Lax',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      domain: req.hostname,
      Path: '/',
    })
    .json({ isLoggedOut: true });
};
