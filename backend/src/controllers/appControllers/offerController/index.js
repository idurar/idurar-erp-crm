import createCRUDController from '#controllers/middlewaresControllers/createCRUDController/index.js';
import create from './create.js';
import summary from './summary.js';
import update from './update.js';
import paginatedList from './paginatedList.js';
import read from './read.js';
import sendMail from './sendMail.js';

const methods = createCRUDController('Offer');

methods.list = paginatedList;
methods.read = read;
methods.mail = sendMail;
methods.create = create;
methods.update = update;
methods.summary = summary;

export default methods;
