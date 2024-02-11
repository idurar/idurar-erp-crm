import mongoose from 'mongoose';

import createCRUDController from '#controllers/middlewaresControllers/createCRUDController/index.js';
import read from './read.js';
import remove from './remove.js';
import paginatedList from './paginatedList.js';

const modelController = () => {
  const Model = mongoose.model('People');
  const methods = createCRUDController('People');

  methods.read = (req, res) => read(Model, req, res);
  methods.delete = (req, res) => remove(Model, req, res);
  methods.list = (req, res) => paginatedList(Model, req, res);

  return methods;
};

export default modelController();
