const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const methods = createCRUDController('Client');

const remove = require('./remove');
const summary = require('./summary');

methods.delete = remove;
methods.summary = summary;

module.exports = methods;
