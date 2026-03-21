const Joi = require('joi');
const mongoose = require('mongoose');
const crypto = require('crypto'); // 1. Using crypto for secure token generation
const checkAndCorrectURL = require('./checkAndCorrectURL');
const sendMail = require('./sendMail');
const { useAppSettings } = require('@/settings');

/**
 * Handles the "forgot password" request.
 *
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {object} models - An object containing the Mongoose models.
 * @param {mongoose.Model} models.User - The User model.
 * @param {mongoose.Model} models.UserPassword - The UserPassword model.
 */
const forgetPassword = async (req, res, { User, UserPassword }) => {
  // 9. Wrap the entire logic in a try...catch block for robust error handling
  try {
    // 2. Validate the request body
    const schema = Joi.object({
      email: Joi.string().email({ tlds: { allow: true } }).required(),
    });
    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ // Use 400 for bad request on validation failure
        success: false,
        message: 'Invalid email format.',
        error: error.details[0].message,
      });
    }
    const { email } = value;

    // 3. Find an active user with the provided email
    const user = await User.findOne({ email, removed: false, enabled: true });

    // 4. SECURITY: To prevent email enumeration, we proceed even if the user is not found.
    // The response will be the same whether the user exists or not.
    if (user) {
      // 5. Generate a cryptographically secure, URL-safe reset token
      const resetToken = crypto.randomBytes(32).toString('hex');

      // 6. SECURITY: Hash the token before storing it in the database.
      // If the DB is compromised, attackers can't use the stored token hashes directly.
      const hashedToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

      // 7. SECURITY: Set an expiration date for the token (e.g., 15 minutes from now)
      const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      // Update the user's password document with the hashed token and its expiry
      await UserPassword.findOneAndUpdate(
        { user: user._id, removed: false },
        {
          $set: {
            resetToken: hashedToken,
            resetTokenExpires: tokenExpiry,
          },
        }
      ).exec();

      // Prepare and send the password reset email
      const settings = useAppSettings();
      const url = checkAndCorrectURL(settings['idurar_base_url']);

      // 8. SECURITY: The link contains the un-hashed token and no user ID.
      const link = `${url}/resetpassword/${resetToken}`;

      await sendMail({
        to: email,
        name: user.name,
        link,
        subject: 'Reset Your Password | idurar',
        from: settings['idurar_app_email'],
        type: 'passwordReset', // Using a more descriptive type
      });
    }

    // Always return a generic success response to prevent attackers from
    // discovering which emails are registered in the system.
    return res.status(200).json({
      success: true,
      message: 'If an account with that email exists, we have sent a password reset link.',
    });
  } catch (err) {
    // Centralized error handler for unexpected issues (e.g., DB down)
    console.error('FORGOT_PASSWORD_ERROR:', err);
    return res.status(500).json({
      success: false,
      message: 'An internal server error occurred. Please try again later.',
    });
  }
};

module.exports = forgetPassword;
