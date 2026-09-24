import createCRUDController from '@/controllers/middlewaresControllers/createCRUDController';
const methods = createCRUDController('Payment');

import create from './create';
import summary from './summary';
import update from './update';
import remove from './remove';
import sendMail from './sendMail';

methods.mail = sendMail;
methods.create = create;
methods.update = update;
methods.delete = remove;
methods.summary = summary;

export default methods;
