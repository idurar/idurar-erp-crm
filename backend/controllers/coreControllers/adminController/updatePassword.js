const mongoose = require('mongoose');
const Admin = mongoose.model('Admin');

const updatePassword = async (req, res) => {
  try {
    let { password } = req.body;

    if (!password) return res.status(400).json({ msg: 'Not all fields have been entered.' });

    if (password.length < 8)
      return res.status(400).json({
        msg: 'The password needs to be at least 8 characters long.',
      });

    // if (password !== passwordCheck)
    //   return res
    //     .status(400)
    //     .json({ msg: "Enter the same password twice for verification." });
    var newAdmin = new Admin();
    const passwordHash = newAdmin.generateHash(password);
    let updates = {
      password: passwordHash,
    };

    // Find document by id and updates with the required fields
    const result = await Admin.findOneAndUpdate(
      { _id: req.params.id, removed: false },
      { $set: updates },
      {
        new: true, // return the new result instead of the old one
      }
    ).exec();
    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found by this id: ' + req.params.id,
      });
    }
    return res.status(200).json({
      success: true,
      result: {
        _id: result._id,
        enabled: result.enabled,
        email: result.email,
        name: result.name,
        surname: result.surname,
        photo: result.photo,
        role: result.role,
      },
      message: 'we update the password by this id: ' + req.params.id,
    });
  } catch (error) {
    // Server Error
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
      error,
    });
  }
};

module.exports = updatePassword;
