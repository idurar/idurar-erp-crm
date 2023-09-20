const mongoose = require('mongoose');
const Admin = mongoose.model('Admin');

const create = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({
        success: false,
        result: null,
        message: "Email or password fields they don't have been entered.",
      });

    const existingAdmin = await Admin.findOne({ email: email });

    if (existingAdmin)
      return res.status(400).json({
        success: false,
        result: null,
        message: 'An account with this email already exists.',
      });

    if (password.length < 8)
      return res.status(400).json({
        success: false,
        result: null,
        message: 'The password needs to be at least 8 characters long.',
      });

    var newAdmin = new Admin();
    const passwordHash = newAdmin.generateHash(password);
    req.body.password = passwordHash;
    req.body.role = 'staff';

    const result = await new Admin(req.body).save();
    if (!result) {
      return res.status(403).json({
        success: false,
        result: null,
        message: "document couldn't save correctly",
      });
    }
    return res.status(200).send({
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
      message: 'Admin document save correctly',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'there is error', error });
  }
};
module.exports = create;
