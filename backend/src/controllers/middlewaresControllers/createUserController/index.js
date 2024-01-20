import create from './create.js';
import read from './read.js';
import update from './update.js';
import updateProfile from './updateProfile.js';
import remove from './remove.js';
import updatePassword from './updatePassword.js';
import updateProfilePassword from './updateProfilePassword.js';
import profile from './profile.js';
import search from './search.js';
import filter from './filter.js';
import listAll from './listAll.js';
import paginatedList from './paginatedList.js';

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

export default createUserController;
