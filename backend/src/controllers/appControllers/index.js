import createCRUDController from '@/controllers/middlewaresControllers/createCRUDController';
import { routesList } from '@/models/utils';

import { globSync } from 'glob';
import { basename } from 'path';

const pattern = './src/controllers/appControllers/*/**/';
const controllerDirectories = globSync(pattern).map((filePath) => {
  return basename(filePath);
});

const appControllers = async() => {
  const controllers = {};
  const hasCustomControllers = [];

for (const controllerName of controllerDirectories) {
    try {
      const customController = await import('@/controllers/appControllers/' + controllerName);

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
