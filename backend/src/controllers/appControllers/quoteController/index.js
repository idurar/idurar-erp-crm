const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const methods = createCRUDController('Quote');

const sendMail = require('./mailQuoteController');
const create = require('./create');
const summary = require('./summary');
const update = require('./update');
const convertQuoteToInvoice = require('./convertQuoteToInvoice');
const paginatedList = require('./paginatedList');
const read = require('./read');

methods.list = paginatedList;
methods.read = read;

methods.sendMail = sendMail;
methods.create = create;
methods.update = update;
methods.convertQuoteToInvoice = convertQuoteToInvoice;
methods.summary = summary;

module.exports = methods;
