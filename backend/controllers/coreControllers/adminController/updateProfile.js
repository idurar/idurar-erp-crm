const mongoose = require('mongoose');
const Admin = mongoose.model('Admin');

const updateProfile = async (req, res) => {
  try {
    console.log('🚀 ~ file: updateProfile.js:7 ~ updateProfile ~ req.admin:', req.admin._id);
    console.log('🚀 ~ file: updateProfile.js:10 ~ updateProfile ~ req.params.id:', req.params.id);
    if (req.admin._id == req.params.id) {
      console.log(
        '🚀 ~ file: updateProfile.js:10 ~ updateProfile ~ req.admin._id === req.params.id'
      );
    }
    if (req.admin._id != req.params.id)
      return res.status(403).json({
        success: false,
        result: null,
        message: "you don't have permission to edit this profile",
      });

    let updates = {
      role: req.body.role,
      email: req.body.email,
      name: req.body.name,
      surname: req.body.surname,
      photo: req.body.photo,
    };
    console.log('🚀 ~ file: updateProfile.js:41 ~ updateProfile ~ updates:', updates);

    // Find document by id and updates with the required fields
    const result = await Admin.findOneAndUpdate(
      { _id: req.params.id, removed: false },
      { $set: updates },
      {
        new: true, // return the new result instead of the old one
      }
    ).exec();
    console.log('🚀 ~ file: updateProfile.js:50 ~ updateProfile ~ result:', result);

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
        _id: result?._id,
        enabled: result?.enabled,
        email: result?.email,
        name: result?.name,
        surname: result?.surname,
        photo: result?.photo,
        role: result?.role,
      },
      message: 'we update this document by this id: ' + req.params.id,
    });
  } catch (error) {
    // Server Error
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Oops there is an Error',
      error: error.message,
    });
  }
};

module.exports = updateProfile;
