const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

const create = require('./create');

function modelController() {
  const modelName = 'Order';
  const Model = mongoose.model(modelName);
  const methods = createCRUDController(modelName);
  methods.create = (req, res) => create(Model, req, res);
  return methods;
}

module.exports = modelController();
