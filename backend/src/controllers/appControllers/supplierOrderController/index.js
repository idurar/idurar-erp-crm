const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const methods = createCRUDController('Quote');

const create = require('./create');
const summary = require('./summary');
const update = require('./update');

methods.create = create;
methods.update = update;

methods.summary = summary;

module.exports = methods;
