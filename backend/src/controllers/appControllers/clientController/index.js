import { model } from 'mongoose';
import createCRUDController from '@/controllers/middlewaresControllers/createCRUDController';

import summary from './summary';

function modelController() {
  const Model = model('Client');
  const methods = createCRUDController('Client');

  methods.summary = (req, res) => summary(Model, req, res);
  return methods;
}

export default modelController();
