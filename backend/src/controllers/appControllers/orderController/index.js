import mongoose from 'mongoose';
import createCRUDController from '#controllers/middlewaresControllers/createCRUDController/index.js';

import create from './create.js';

const modelController = () => {
  const modelName = 'Order';
  const Model = mongoose.model(modelName);
  const methods = createCRUDController(modelName);
  methods.create = (req, res) => create(Model, req, res);
  return methods;
};

export default modelController();
