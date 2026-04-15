const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const crudController = createCRUDController('Setting');

const listBySettingKey = require('./listBySettingKey');
const readBySettingKey = require('./readBySettingKey');
const updateBySettingKey = require('./updateBySettingKey');
const updateManySetting = require('./updateManySetting');
const listAll = require('./listAll');
const read = require('./read');
const list = require('./list');
const search = require('./search');
const filter = require('./filter');

const settingMethods = {
  read: read,
  create: crudController.create,
  update: crudController.update,
  list: list,
  filter: filter,
  search: search,
  listAll: listAll,
  listBySettingKey,
  readBySettingKey,
  updateBySettingKey,
  updateManySetting,
};

module.exports = settingMethods;
