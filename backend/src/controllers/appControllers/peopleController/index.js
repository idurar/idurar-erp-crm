const mongoose = require('mongoose');

const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const read = require('./read');
const remove = require('./remove');
const paginatedList = require('./paginatedList');

function modelController() {
  const Model = mongoose.model('People');
  const methods = createCRUDController('People');

  methods.read = (req, res) => read(Model, req, res);
  methods.delete = (req, res) => remove(Model, req, res);
  methods.list = (req, res) => paginatedList(Model, req, res);

  return methods;
}

module.exports = modelController();
