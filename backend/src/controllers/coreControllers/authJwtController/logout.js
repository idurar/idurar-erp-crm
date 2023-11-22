const mongoose = require('mongoose');

const Admin = mongoose.model('Admin');

const logout = async (req, res) => {
  const token = req.cookies.token;
  await Admin.findOneAndUpdate(
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
    .json({
      success: true,
      result: {},
      message: 'Successfully logout',
    });
};

module.exports = logout;
