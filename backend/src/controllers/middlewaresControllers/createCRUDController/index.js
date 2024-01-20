import mongoose from 'mongoose';
import { modelsFiles } from '#models/utils/index.js';

import create from './create.js';
import read from './read.js';
import update from './update.js';
import remove from './remove.js';
import search from './search.js';
import filter from './filter.js';
import summary from './summary.js';
import listAll from './listAll.js';
import paginatedList from './paginatedList.js';

const createCRUDController = (modelName) => {
  if (!modelsFiles.includes(modelName)) {
    throw new Error(`Model ${modelName} does not exist`);
  }

  const Model = mongoose.model(modelName);
  let crudMethods = {
    create: (req, res) => create(Model, req, res),
    read: (req, res) => read(Model, req, res),
    update: (req, res) => update(Model, req, res),
    delete: (req, res) => remove(Model, req, res),
    list: (req, res) => paginatedList(Model, req, res),
    listAll: (req, res) => listAll(Model, req, res),
    search: (req, res) => search(Model, req, res),
    filter: (req, res) => filter(Model, req, res),
    summary: (req, res) => summary(Model, req, res),
  };
  return crudMethods;
};

export default createCRUDController;
