const isValidAdminToken = require('./isValidAdminToken');
const login = require('./login');
const logout = require('./logout');
const register = require('./register');

const authJwtController = {
  isValidAdminToken,
  login,
  logout,
  register,
};

module.exports = authJwtController;
