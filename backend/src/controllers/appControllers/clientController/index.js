const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const remove = require('./remove');
const summary = require('./summary');

const create = require('./create');
const read = require('./read');
const search = require('./search');

const listAll = require('./listAll');
const paginatedList = require('./paginatedList');

function modelController() {
  const methods = createCRUDController('Client');
  methods.delete = remove;
  methods.summary = summary;
  methods.create = create;
  methods.read = read;
  methods.search = search;
  methods.list = paginatedList;
  methods.listAll = listAll;
  return methods;
}

module.exports = modelController();
