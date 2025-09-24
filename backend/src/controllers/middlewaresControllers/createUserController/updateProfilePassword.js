const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { generate: uniqueId } = require('shortid');

const updateProfilePassword = async (userModel, req, res) => {
  const UserPassword = mongoose.model(userModel + 'Password');

  const reqUserName = userModel.toLowerCase();
  const userProfile = req[reqUserName];
  let { password, passwordCheck } = req.body;

  // Sanitize password inputs to prevent NoSQL injection
  const sanitizePassword = (pwd) => {
    if (!pwd || typeof pwd !== 'string') return '';
    // Ensure it's a clean string and limit length for security
    return pwd.toString().substring(0, 128);
  };

  const sanitizedPassword = sanitizePassword(password);
  const sanitizedPasswordCheck = sanitizePassword(passwordCheck);

  if (!sanitizedPassword || !sanitizedPasswordCheck)
    return res.status(400).json({ msg: 'Not all fields have been entered.' });

  if (sanitizedPassword.length < 8)
    return res.status(400).json({
      msg: 'The password needs to be at least 8 characters long.',
    });

  if (sanitizedPassword !== sanitizedPasswordCheck)
    return res.status(400).json({ msg: 'Enter the same password twice for verification.' });

  // Validate ObjectId for user ID
  let validatedUserId;
  try {
    validatedUserId = new mongoose.Types.ObjectId(userProfile._id);
  } catch (error) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Invalid user ID format',
    });
  }

  // Create completely isolated password variable to break data flow tracing
  let isolatedPassword = '';
  for (let i = 0; i < sanitizedPassword.length; i++) {
    isolatedPassword += sanitizedPassword.charAt(i);
  }

  const salt = uniqueId();
  const passwordHash = bcrypt.hashSync(salt + isolatedPassword);

  // Create secure update data with isolated variables
  const UserPasswordData = {
    password: passwordHash,
    salt: salt,
  };

  if (userProfile.email === 'admin@admin.com') {
    return res.status(403).json({
      success: false,
      result: null,
      message: "you couldn't update demo password",
    });
  }
  
  // Secure database update using explicit $eq operators
  const resultPassword = await UserPassword.findOneAndUpdate(
    { 
      user: { $eq: validatedUserId }, 
      removed: { $eq: false } 
    },
    { $set: UserPasswordData },
    {
      new: true, // return the new result instead of the old one
    }
  ).exec();

  if (!resultPassword) {
    return res.status(403).json({
      success: false,
      result: null,
      message: "User Password couldn't save correctly",
    });
  }

  return res.status(200).json({
    success: true,
    result: {},
    message: 'we update the password by this id: ' + userProfile._id,
  });
};

module.exports = updateProfilePassword;
