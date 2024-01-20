import isValidAuthToken from './isValidAuthToken.js';
import login from './login.js';
import logout from './logout.js';
import register from './register.js';
import verify from './verify.js';
import forgetPassword from './forgetPassword.js';
import resetPassword from './resetPassword.js';

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
  authMethods.verify = (req, res) =>
    verify(req, res, {
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

export default createAuthMiddleware;
