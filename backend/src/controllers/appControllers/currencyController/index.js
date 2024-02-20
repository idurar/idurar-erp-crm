const mongoose = require('mongoose');

const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

const remove = require('./remove');
const update = require('./update');

function modelController() {
  const Model = mongoose.model('Currency');
  const methods = createCRUDController('Currency');

  methods.update = (req, res) => update(Model, req, res);
  methods.delete = (req, res) => remove(Model, req, res);

  return methods;
}

module.exports = modelController();
