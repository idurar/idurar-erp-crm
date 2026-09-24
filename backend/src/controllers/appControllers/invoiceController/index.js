import createCRUDController from '@/controllers/middlewaresControllers/createCRUDController';
const methods = createCRUDController('Invoice');

import sendMail from './sendMail';
import create from './create';
import summary from './summary';
import update from './update';
import remove from './remove';
import paginatedList from './paginatedList';
import read from './read';

methods.mail = sendMail;
methods.create = create;
methods.update = update;
methods.delete = remove;
methods.summary = summary;
methods.list = paginatedList;
methods.read = read;

export default methods;
