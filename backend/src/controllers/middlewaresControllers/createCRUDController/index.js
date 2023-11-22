const mongoose = require('mongoose');

const create = require('./create');
const read = require('./read');
const update = require('./update');
const remove = require('./remove');
const search = require('./search');
const filter = require('./filter');
const listAll = require('./listAll');
const paginatedList = require('./paginatedList');

const createCRUDController = (modelName) => {
  const Model = mongoose.model(modelName);
  let crudMethods = {};

  crudMethods.create = (req, res) => create(Model, req, res);
  crudMethods.read = (req, res) => read(Model, req, res);
  crudMethods.update = (req, res) => update(Model, req, res);
  crudMethods.delete = (req, res) => remove(Model, req, res);
  crudMethods.list = (req, res) => paginatedList(Model, req, res);
  crudMethods.listAll = (req, res) => listAll(Model, req, res);
  crudMethods.search = (req, res) => search(Model, req, res);
  crudMethods.filter = (req, res) => filter(Model, req, res);

  return crudMethods;
};

module.exports = createCRUDController;
