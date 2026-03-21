const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, country } = req.body;
    
    // Validation
    if (!name || !email || !password || !confirmPassword || !country) {
      return res.status(400).json({
        success: false,
        result: null,
        message: "All fields are required"
      });
    }
    
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        result: null,
        message: "Passwords do not match"
      });
    }
    
    // Check if user already exists
    // Create user
    // Return success
    
    res.status(201).json({
      success: true,
      result: { name, email, country },
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

module.exports = { register };