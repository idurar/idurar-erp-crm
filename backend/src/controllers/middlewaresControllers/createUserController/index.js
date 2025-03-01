const read = require('./read');
const updateProfile = require('./updateProfile');

const updatePassword = require('./updatePassword');
const updateProfilePassword = require('./updateProfilePassword');

const createUserController = (userModel) => {
  let userController = {};

  userController.updateProfile = (req, res) => updateProfile(userModel, req, res);
  userController.updatePassword = (req, res) => updatePassword(userModel, req, res);
  userController.updateProfilePassword = (req, res) => updateProfilePassword(userModel, req, res);

  userController.read = (req, res) => read(userModel, req, res);

  return userController;
};

module.exports = createUserController;
