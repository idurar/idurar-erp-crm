const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const methods = createCRUDController('Quote');

methods.create = require('./create');
methods.update = require('./update');
methods.delete = require('./remove');
methods.mail = require('./sendMail');
methods.convert = require('./convert');
methods.summary = require('./summary');

module.exports = methods;
