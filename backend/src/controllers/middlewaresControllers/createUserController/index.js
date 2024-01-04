import create from './create';
import read from './read';
import update from './update';
import updateProfile from './updateProfile';
import remove from './remove';
import updatePassword from './updatePassword';
import updateProfilePassword from './updateProfilePassword';
import profile from './profile';
import search from './search';
import filter from './filter';
import listAll from './listAll';
import paginatedList from './paginatedList';

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
