import createCRUDController from '@/controllers/middlewaresControllers/createCRUDController';
const crudController = createCRUDController('Setting');

import listBySettingKey from './listBySettingKey';
import readBySettingKey from './readBySettingKey';
import updateBySettingKey from './updateBySettingKey';
import updateManySetting from './updateManySetting';
import listAll from './listAll';

const settingMethods = {
  read: crudController.read,
  create: crudController.create,
  update: crudController.update,
  list: crudController.list,
  filter: crudController.filter,
  search: crudController.search,
  listAll: listAll,
  listBySettingKey,
  readBySettingKey,
  updateBySettingKey,
  updateManySetting,
};

export default settingMethods;
