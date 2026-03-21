const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('@/models/coreModels/Admin');

// ✅ Password strength validation function
const validatePassword = (password) => {
  // At least 8 chars, one uppercase, one lowercase, one number, one special char
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, country } = req.body;
    
    // ✅ Basic field validation
    if (!name || !email || !password || !confirmPassword || !country) {
      return res.status(400).json({
        success: false,
        result: null,
        message: "All fields are required"
      });
    }
    
    // ✅ Check password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        result: null,
        message: "Passwords do not match"
      });
    }

    // ✅ Enforce password strength
    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        result: null,
        message:
          "Weak password. It must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      });
    }

    // ✅ Check if user already exists
    const existingUser = await Admin.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        result: null,
        message: "Email already registered"
      });
    }

    // ✅ Hash password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ Create new user record
    const user = await Admin.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      country
    });

    // ✅ Respond success
    res.status(201).json({
      success: true,
      result: {
        _id: user._id,
        name: user.name,
        email: user.email,
        country: user.country
      },
      message: "User registered successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      result: null,
      message: error.message
    });
  }
};

const login = async (req, res) => {
  res.json({ message: "Login endpoint - to be implemented" });
};

module.exports = {
  register,
  login
};
