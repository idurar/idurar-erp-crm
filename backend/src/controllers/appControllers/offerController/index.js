const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const methods = createCRUDController('Offer');

const create = require('./create');
const summary = require('./summary');
const update = require('./update');
const paginatedList = require('./paginatedList');
const read = require('./read');
const sendMail = require('./sendMail');

methods.list = paginatedList;
methods.read = read;
methods.mail = sendMail;
methods.create = create;
methods.update = update;
methods.summary = summary;

module.exports = methods;
