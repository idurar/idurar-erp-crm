const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { stubFalse } = require('lodash');

const mongoose = require('mongoose');

const Admin = mongoose.model('Admin');

require('dotenv').config({ path: '.variables.env' });

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const clientIP = req.connection.remoteAddress;
    let isLocalhost = false;
    if (clientIP === '127.0.0.1' || clientIP === '::1') {
      // Connection is from localhost
      isLocalhost = true;
    }
    // validate
    const objectSchema = Joi.object({
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required(),
      password: Joi.string().required(),
    });

    const { error, value } = objectSchema.validate({ email, password });
    if (error) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Invalid/Missing credentials.',
      });
    }

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
          id: result._id,
          name: result.name,
          surname: result.surname,
          role: result.role,
          email: result.email,
          photo: result.photo,
          isLoggedIn: result.isLoggedIn > 0 ? true : false,
        },
        message: 'Successfully login admin',
      });
  } catch (err) {
    res.status(500).json({ success: false, result: null, message: err.message, error: err });
  }
};

module.exports = login;
