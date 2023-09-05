const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const crudController = createCRUDController('Setting');

const settingMethods = {
  read: crudController.read,
  create: crudController.create,
  update: crudController.update,
  list: crudController.list,
  listAll: crudController.listAll,
  filter: crudController.filter,
  search: crudController.search,
};

module.exports = settingMethods;
