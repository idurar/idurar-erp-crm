const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const methods = createCRUDController('Invoice');

const sendMail = require('./sendMail');
const create = require('./create');
const summary = require('./summary');
const update = require('./update');
const remove = require('./remove');
const paginatedList = require('./paginatedList');
const read = require('./read');
const remind = require('./remind');
const cancel = require('./cancel');
const issue = require('./issue');
const creditNote = require('./creditNote');
const recurrence = require('./recurrence');

methods.mail = sendMail;
methods.create = create;
methods.update = update;
methods.delete = remove;
methods.summary = summary;
methods.list = paginatedList;
methods.read = read;
methods.remind = remind;
methods.cancel = cancel;
methods.issue = issue;
methods.creditNote = creditNote;
methods.recurrence = recurrence;

module.exports = methods;
