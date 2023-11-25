const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const { routesList } = require('@/models/utils');

const { globSync } = require('glob');
const path = require('path');

const pattern = './src/controllers/appControllers/*/**/';
const controllerDirectories = globSync(pattern).map((filePath) => {
  return path.basename(filePath);
});

const appControllers = () => {
  const controllers = {};
  const hasCustomeControllers = [];
  controllerDirectories.forEach((controllerName) => {
    try {
      const customController = require('@/controllers/appControllers/' + controllerName);
      if (customController) {
        hasCustomeControllers.push(controllerName);
        controllers[controllerName] = customController;
      }
    } catch (err) {}
  });

  routesList.forEach(({ modelName, controllerName }) => {
    if (!hasCustomeControllers.includes(controllerName)) {
      controllers[controllerName] = createCRUDController(modelName);
    }
  });

  return controllers;
};

module.exports = appControllers();
