import createCRUDController from '#controllers/middlewaresControllers/createCRUDController/index.js';

const methods = createCRUDController('Invoice');

import sendMail from './sendMail.js';
import create from './create.js';
import summary from './summary.js';
import update from './update.js';
import remove from './remove.js';
import paginatedList from './paginatedList.js';
import read from './read.js';

methods.mail = sendMail;
methods.create = create;
methods.update = update;
methods.delete = remove;
methods.summary = summary;
methods.list = paginatedList;
methods.read = read;

export default methods;
