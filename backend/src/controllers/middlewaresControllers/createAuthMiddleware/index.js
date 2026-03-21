const isValidAuthToken = require('./isValidAuthToken');
const login = require('./login');
const logout = require('./logout');
const forgetPassword = require('./forgetPassword');
const resetPassword = require('./resetPassword');
const refreshToken = require('./refreshToken');
const authUser = require('./authUser'); // <- IMPORTANT

const createAuthMiddleware = (userModel) => {
  const authMethods = {};

  // Validate token middleware
  authMethods.isValidAuthToken = (req, res, next) =>
    isValidAuthToken(req, res, next, { userModel });

  // Login
  authMethods.login = (req, res) =>
    login(req, res, { userModel, authUser });

  // Forgot password
  authMethods.forgetPassword = (req, res) =>
    forgetPassword(req, res, { userModel });

  // Reset password
  authMethods.resetPassword = (req, res) =>
    resetPassword(req, res, { userModel });

  // Logout
  authMethods.logout = (req, res) =>
    logout(req, res, { userModel });

  // 🔥 Refresh token 
  authMethods.refreshToken = (req, res) =>
    refreshToken(req, res, { userModel });

  return authMethods;
};

module.exports = createAuthMiddleware;
