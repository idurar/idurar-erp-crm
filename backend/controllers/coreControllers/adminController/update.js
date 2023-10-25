const mongoose = require('mongoose');
const Admin = mongoose.model('Admin');

const update = async (req, res) => {
  try {
    // let { email } = req.body;

    // if (email) {
    //   const existingAdmin = await Admin.findOne({ email: email });

    //   if (existingAdmin._id != req.params.id)
    //     return res.status(400).json({ message: 'An account with this email already exists.' });
    // }
    let updates = {
      role: req.body.role,
      email: req.body.email,
      name: req.body.name,
      surname: req.body.surname,
      photo: req.body.photo,
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
      message: 'we update this document by this id: ' + req.params.id,
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

module.exports = update;
