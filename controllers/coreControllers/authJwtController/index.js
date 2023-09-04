const isValidAdminToken = require('./isValidAdminToken');
const login = require('./login');
const logout = require('./logout');

const authJwtController = {
  isValidAdminToken,
  login,
  logout,
};

module.exports = authJwtController;
