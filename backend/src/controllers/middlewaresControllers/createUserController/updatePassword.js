const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { generate: uniqueId } = require('shortid');

const updatePassword = async (userModel, req, res) => {
  try {
    const UserPasswordModel = mongoose.model(userModel + 'Password');
    const reqUserName = userModel.toLowerCase();
    const user = req[reqUserName];
    const { password } = req.body;

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'The password needs to be at least 8 characters long.',
      });
    }

    const salt = await bcrypt.genSalt(10); // Generate a salt with cost factor 10
    const passwordHash = await bcrypt.hash(password, salt);

    const userPasswordData = {
      password: passwordHash,
      salt: salt,
    };

    const updatedUserPassword = await UserPasswordModel.findOneAndUpdate(
      { user: user._id, removed: false },
      { $set: userPasswordData },
      { new: true }
    );

    if (!updatedUserPassword) {
      return res.status(404).json({
        success: false,
        message: "User's password couldn't be updated.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Password updated for user with ID: ${user._id}`,
    });
  } catch (error) {
    console.error('Error updating password:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

module.exports = updatePassword;
