const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

const summary = require('./summary');
const create = require('./create'); // Import our new create method
const update = require('./update'); // Import our new update method

function modelController() {
  const Model = mongoose.model('Client');
  const methods = createCRUDController('Client');

  // Override the generic methods with our custom validated ones
  methods.create = create;
  methods.update = update;
  methods.summary = (req, res) => summary(Model, req, res);

  return methods;
}

module.exports = modelController();
