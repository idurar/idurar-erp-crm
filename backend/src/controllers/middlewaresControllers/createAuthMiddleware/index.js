const isValidAuthToken = require('./isValidAuthToken');
const login = require('./login');
const logout = require('./logout');
const forgetPassword = require('./forgetPassword');
const resetPassword = require('./resetPassword');
const register = require('./register');
const googleAuth = require('./googleAuth');

const createAuthMiddleware = (userModel) => {
  let authMethods = {};

  authMethods.isValidAuthToken = (req, res, next) =>
    isValidAuthToken(req, res, next, {
      userModel,
    });

  authMethods.login = (req, res) =>
    login(req, res, {
      userModel,
    });

  authMethods.register = (req, res) =>
    register(req, res, {
      userModel,
    });

  authMethods.googleAuth = (req, res) =>
    googleAuth(req, res, {
      userModel,
    });

  authMethods.forgetPassword = (req, res) =>
    forgetPassword(req, res, {
      userModel,
    });

  authMethods.resetPassword = (req, res) =>
    resetPassword(req, res, {
      userModel,
    });

  authMethods.logout = (req, res) =>
    logout(req, res, {
      userModel,
    });
  return authMethods;
};

module.exports = createAuthMiddleware;
