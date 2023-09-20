const mongoose = require('mongoose');

const Admin = mongoose.model('Admin');

require('dotenv').config({ path: '.variables.env' });

const logout = async (req, res) => {
  try {
    const token = req.cookies.token;
    const result = await Admin.findOneAndUpdate(
      { _id: req.admin._id },
      { $pull: { loggedSessions: token } },
      {
        new: true,
      }
    ).exec();

    res
      .clearCookie('token', {
        maxAge: null,
        sameSite: 'Lax',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' ? true : false,
        domain: req.hostname,
        Path: '/',
      })
      .json({ isLoggedOut: true });
  } catch (error) {
    res.status(500).json({ success: false, result: null, message: err.message, error: err });
  }
};

module.exports = logout;
