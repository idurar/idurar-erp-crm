const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const methods = createCRUDController('Invoice');

const sendMail = require('./mailInvoiceController');
const create = require('./create');
const summary = require('./summary');
const update = require('./update');
const remove = require('./remove');

methods.sendMail = sendMail;
methods.create = create;
methods.update = update;
methods.delete = remove;
methods.summary = summary;

module.exports = methods;
