const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const { routesList } = require('@/models/utils');

const appControllers = {};
const hasCustomeControllers = [];

const { globSync } = require('glob');
const path = require('path');

const pattern = './src/controllers/appControllers/*/**/';
const controllerDirectories = globSync(pattern).map((filePath) => {
  return path.basename(filePath);
});

controllerDirectories.forEach((controllerName) => {
  try {
    const customController = require('@/controllers/appControllers/' + controllerName);

    if (customController) {
      hasCustomeControllers.push(controllerName);
      appControllers[controllerName] = customController;
    }
  } catch (err) {}
});

routesList.forEach(({ modelName, controllerName }) => {
  if (!hasCustomeControllers.includes(controllerName)) {
    appControllers[controllerName] = createCRUDController(modelName);
  }
});

module.exports = appControllers;
