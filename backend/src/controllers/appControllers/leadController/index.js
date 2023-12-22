import mongoose from 'mongoose';
import createCRUDController from '#controllers/middlewaresControllers/createCRUDController/index.js';

import remove from './remove.js';
import summary from './summary.js';

import create from './create.js';
import update from './update.js';
import read from './read.js';
import search from './search.js';

import listAll from './listAll.js';
import paginatedList from './paginatedList.js';

const modelController = () => {
  const modelName = 'Lead';
  const Model = mongoose.model(modelName);
  const methods = createCRUDController(modelName);
  methods.read = (req, res) => read(Model, req, res);
  methods.delete = (req, res) => remove(Model, req, res);
  methods.list = (req, res) => paginatedList(Model, req, res);
  methods.summary = (req, res) => summary(Model, req, res);
  methods.create = (req, res) => create(Model, req, res);
  methods.update = (req, res) => update(Model, req, res);
  methods.search = (req, res) => search(Model, req, res);
  methods.listAll = (req, res) => listAll(Model, req, res);
  return methods;
};

export default modelController();
