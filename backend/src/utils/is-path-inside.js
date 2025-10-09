const path = require('path');

// is implementation of is-path-inside npm package

exports.isPathInside = (childPath, parentPath) => {
  const relation = path.relative(parentPath, childPath);

  return Boolean(
    relation &&
      relation !== '..' &&
      !relation.startsWith(`..${path.sep}`) &&
      relation !== path.resolve(childPath)
  );
};
