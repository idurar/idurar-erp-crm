import createCRUDController from '#controllers/middlewaresControllers/createCRUDController/index.js';
import listBySettingKey from './listBySettingKey.js';
import readBySettingKey from './readBySettingKey.js';
import updateBySettingKey from './updateBySettingKey.js';
import updateManySetting from './updateManySetting.js';
import listAll from './listAll.js';

const crudController = createCRUDController('Setting');

const settingMethods = {
  read: crudController.read,
  create: crudController.create,
  update: crudController.update,
  list: crudController.list,
  filter: crudController.filter,
  search: crudController.search,
  listAll,
  listBySettingKey,
  readBySettingKey,
  updateBySettingKey,
  updateManySetting,
};

export default settingMethods;
