const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const methods = createCRUDController('Payment');

const create = require('./create');
const summary = require('./summary');
const update = require('./update');
const remove = require('./remove');

methods.create = create;
methods.update = update;
methods.delete = remove;
methods.summary = summary;

module.exports = methods;
