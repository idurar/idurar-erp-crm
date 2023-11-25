const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const { routesList } = require('@/models/utils');

const appControllers = {};
const hasCustomeControllers = [];

routesList.forEach(({ modelName, controllerName }) => {
  try {
    const customController = require('@/controllers/appControllers/' + controllerName);

    if (customController) {
      hasCustomeControllers.push(controllerName);
      appControllers[controllerName] = customController;
    }
  } catch (err) {}

  if (!hasCustomeControllers.includes(controllerName)) {
    appControllers[controllerName] = createCRUDController(modelName);
  }
});

console.log('🚀 ~ file: index.js:6 ~ hasCustomeControllers:', hasCustomeControllers);

module.exports = appControllers;
