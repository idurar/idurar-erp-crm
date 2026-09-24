import read from './read';
import updateProfile from './updateProfile';

import updatePassword from './updatePassword';
import updateProfilePassword from './updateProfilePassword';

const createUserController = (userModel) => {
  let userController = {};

  userController.updateProfile = (req, res) => updateProfile(userModel, req, res);
  userController.updatePassword = (req, res) => updatePassword(userModel, req, res);
  userController.updateProfilePassword = (req, res) => updateProfilePassword(userModel, req, res);

  userController.read = (req, res) => read(userModel, req, res);

  return userController;
};

export default createUserController;
