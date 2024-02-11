import mongoose from 'mongoose';
import { modelsFiles } from '#models/utils/index.js';
import createCRUDController from '#controllers/middlewaresControllers/createCRUDController/index.js';

import remove from './remove.js';

const modelController = () => {
  const modelName = 'Company';

  if (!modelsFiles.includes(modelName)) {
    throw new Error(`Model ${modelName} does not exist`);
  } else {
    const Model = mongoose.model(modelName);
    const methods = createCRUDController(modelName);

    methods.delete = (req, res) => remove(Model, req, res);

    return methods;
  }
};

export default modelController();
