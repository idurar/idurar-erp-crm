import { globSync } from 'glob';
import path from 'path';
import createCRUDController from '#controllers/middlewaresControllers/createCRUDController/index.js';
import { routesList } from '#models/utils/index.js';

const pattern = './src/controllers/appControllers/*/**/';
const controllerDirectories = globSync(pattern).map((filePath) => {
  return path.basename(filePath);
});

const appControllers = async () => {
  const controllers = {};
  const hasCustomControllers = [];

  controllerDirectories.forEach(async (controllerName) => {
    try {
      const customController = await import(
        `#controllers/appControllers/${controllerName}/index.js`
      );

      if (customController) {
        hasCustomControllers.push(controllerName);
        controllers[controllerName] = customController;
      }
    } catch (err) {
      throw new Error(err.message);
    }
  });

  routesList.forEach(({ modelName, controllerName }) => {
    if (!hasCustomControllers.includes(controllerName)) {
      controllers[controllerName] = createCRUDController(modelName);
    }
  });

  return controllers;
};

export default appControllers();
