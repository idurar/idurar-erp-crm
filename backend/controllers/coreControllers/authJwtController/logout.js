const mongoose = require('mongoose');

const Admin = mongoose.model('Admin');

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
        sameSite: 'none',
        httpOnly: true,
        secure: true,
        domain: req.hostname,
        Path: '/',
      })
      .json({ isLoggedOut: true });
  } catch (error) {
    res.status(500).json({ success: false, result: null, message: error.message, error: error });
  }
};

module.exports = logout;
