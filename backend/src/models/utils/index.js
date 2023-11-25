const { basename, extname } = require('path');
const { globSync } = require('glob');

const modelsFiles = globSync('./src/models/appModels/**/*.js');

const constrollersList = [];
const modelslist = [];
const entityList = [];
const routesList = [];

for (const filePath of modelsFiles) {
  const fileNameWithExtension = basename(filePath);
  const fileNameWithoutExtension = fileNameWithExtension.replace(
    extname(fileNameWithExtension),
    ''
  );
  const firstChar = fileNameWithoutExtension.charAt(0);
  const modelName = fileNameWithoutExtension.replace(firstChar, firstChar.toUpperCase());
  const fileNameLowerCaseFirstChar = fileNameWithoutExtension.replace(
    firstChar,
    firstChar.toLowerCase()
  );
  const entity = fileNameWithoutExtension.toLowerCase();

  controllerName = fileNameLowerCaseFirstChar + 'Controller';
  constrollersList.push(controllerName);
  modelslist.push(modelName);
  entityList.push(entity);

  const route = {
    entity: entity,
    modelName: modelName,
    controllerName: controllerName,
  };
  routesList.push(route);
}

module.exports = { constrollersList, modelslist, entityList, routesList };
