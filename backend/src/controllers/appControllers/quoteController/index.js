import createCRUDController from '#controllers/middlewaresControllers/createCRUDController/index.js';

import sendMail from './sendMail.js';
import create from './create.js';
import summary from './summary.js';
import update from './update.js';
import convertQuoteToInvoice from './convertQuoteToInvoice.js';
import paginatedList from './paginatedList.js';
import read from './read.js';

const methods = createCRUDController('Quote');

methods.list = paginatedList;
methods.read = read;

methods.mail = sendMail;
methods.create = create;
methods.update = update;
methods.convert = convertQuoteToInvoice;
methods.summary = summary;

export default methods;
