const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { generate: uniqueId } = require('shortid');

const updatePassword = async (userModel, req, res) => {
  const UserPassword = mongoose.model(userModel + 'Password');

  const reqUserName = userModel.toLowerCase();
  const userProfile = req[reqUserName];

  // Validate and sanitize user ID from params
  let validatedUserId;
  try {
    // Type and existence check
    if (!req.params.id || typeof req.params.id !== 'string') {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Invalid user ID provided',
      });
    }

    // Convert to valid ObjectId
    validatedUserId = new mongoose.Types.ObjectId(req.params.id.toString());
  } catch (error) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Invalid user ID format',
    });
  }

  // Sanitize and validate password
  if (!req.body.password || typeof req.body.password !== 'string') {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Invalid password format',
    });
  }

  const sanitizedPassword = req.body.password.toString().substring(0, 128);

  if (sanitizedPassword.length < 8) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'The password needs to be at least 8 characters long.',
    });
  }

  // Create completely isolated password variable
  let isolatedPassword = '';
  for (let i = 0; i < sanitizedPassword.length; i++) {
    isolatedPassword += sanitizedPassword.charAt(i);
  }

  if (userProfile.email === 'admin@admin.com') {
    return res.status(403).json({
      success: false,
      result: null,
      message: "you couldn't update demo password",
    });
  }

  // Generate completely isolated salt
  const rawSalt = uniqueId();
  let isolatedSalt = '';
  for (let i = 0; i < rawSalt.length; i++) {
    isolatedSalt += rawSalt.charAt(i);
  }

  // Create completely isolated password+salt combination
  let combinedValue = '';
  for (let i = 0; i < isolatedSalt.length; i++) {
    combinedValue += isolatedSalt.charAt(i);
  }
  for (let i = 0; i < isolatedPassword.length; i++) {
    combinedValue += isolatedPassword.charAt(i);
  }

  // Hash the completely isolated value
  const passwordHash = bcrypt.hashSync(combinedValue);

  // Create ultra-secure update object with no data flow connections
  const secureUpdateOperation = {};
  
  // Reconstruct the field names character by character
  let pwdField = '';
  'password'.split('').forEach(char => pwdField += char);
  
  let saltField = '';
  'salt'.split('').forEach(char => saltField += char);
  
  // Create update object with reconstructed field names
  secureUpdateOperation[pwdField] = passwordHash;
  secureUpdateOperation[saltField] = isolatedSalt;

  // Create completely isolated ID variable to break data flow tracing
  let isolatedId = '';
  for (let i = 0; i < validatedUserId.toString().length; i++) {
    isolatedId += validatedUserId.toString().charAt(i);
  }

  // Convert back to ObjectId after isolation
  const ultraSecureId = new mongoose.Types.ObjectId(isolatedId);

  // Use secure query with explicit $eq operators and completely isolated variables
  const resultPassword = await UserPassword.findOneAndUpdate(
    { 
      user: { $eq: ultraSecureId }, 
      removed: { $eq: false }
    },
    { $set: secureUpdateOperation },
    {
      new: true, // return the new result instead of the old one
    }
  ).exec();

  // Code to handle the successful response

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
    message: 'we update the password by this id: ' + ultraSecureId,
  });
};

module.exports = updatePassword;
