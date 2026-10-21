const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

const summary = require('./summary');
const create = require('./create');
const paginatedList = require('./paginatedList');
const update = require('./update');

function modelController() {
  const Model = mongoose.model('Client');
  const methods = createCRUDController('Client');

  methods.summary = (req, res) => summary(Model, req, res);
  methods.create = create;
  methods.list = paginatedList;
  methods.update = update;
  return methods;
}

module.exports = modelController();
