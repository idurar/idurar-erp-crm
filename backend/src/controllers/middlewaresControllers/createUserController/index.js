const create = require('./create');
const read = require('./read');
const update = require('./update');
const updateProfile = require('./updateProfile');
const remove = require('./remove');
const updatePassword = require('./updatePassword');
const updateProfilePassword = require('./updateProfilePassword');
const profile = require('./profile');
const search = require('./search');
const filter = require('./filter');
const listAll = require('./listAll');
const paginatedList = require('./paginatedList');

const createUserController = (userModel) => {
  let userController = {};

  userController.create = (req, res) => create(userModel, req, res);
  userController.updateProfile = (req, res) => updateProfile(userModel, req, res);
  userController.updatePassword = (req, res) => updatePassword(userModel, req, res);
  userController.updateProfilePassword = (req, res) => updateProfilePassword(userModel, req, res);
  userController.profile = (req, res) => profile(userModel, req, res);
  userController.read = (req, res) => read(userModel, req, res);
  userController.update = (req, res) => update(userModel, req, res);
  userController.delete = (req, res) => remove(userModel, req, res);
  userController.list = (req, res) => paginatedList(userModel, req, res);
  userController.listAll = (req, res) => listAll(userModel, req, res);
  userController.search = (req, res) => search(userModel, req, res);
  userController.filter = (req, res) => filter(userModel, req, res);
  return userController;
};

module.exports = createUserController;
