const mongoose = require('mongoose');

const create = require('./create');
const read = require('./read');
const update = require('./update');
const remove = require('./remove');
const search = require('./search');
const filter = require('./filter');
const listAll = require('./listAll');
const paginatedList = require('./paginatedList');

const createCRUDController = ({ settingKey }) => {
  const Model = mongoose.model('Setting');
  let crudMethods = {};

  crudMethods.create = async (req, res) => {
    create(Model, settingKey, req, res);
  };
  crudMethods.read = async (req, res) => {
    read(Model, settingKey, req, res);
  };
  crudMethods.update = async (req, res) => {
    update(Model, settingKey, req, res);
  };
  crudMethods.delete = async (req, res) => {
    remove(Model, settingKey, req, res);
  };
  crudMethods.list = async (req, res) => {
    paginatedList(Model, settingKey, req, res);
  };
  crudMethods.listAll = async (req, res) => {
    listAll(Model, settingKey, req, res);
  };
  crudMethods.search = async (req, res) => {
    search(Model, settingKey, req, res);
  };

  crudMethods.filter = async (req, res) => {
    filter(Model, settingKey, req, res);
  };

  return crudMethods;
};

module.exports = createCRUDController;
