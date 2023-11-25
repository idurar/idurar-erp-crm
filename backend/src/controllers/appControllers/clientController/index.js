const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const remove = require('./remove');
const summary = require('./summary');

function modelController() {
  const methods = createCRUDController('Client');
  methods.delete = remove;
  methods.summary = summary;
  return methods;
}

module.exports = modelController();
