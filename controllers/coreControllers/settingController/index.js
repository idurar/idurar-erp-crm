const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const crudController = createCRUDController('Setting');

const settingMethods = {
  create: crudController.create,
  update: crudController.update,
  list: crudController.list,
  listAll: crudController.listAll,
  read: crudController.read,
};

module.exports = settingMethods;
