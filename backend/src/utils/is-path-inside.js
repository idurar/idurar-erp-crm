import { relative, sep, resolve } from 'path';

// is implementation of is-path-inside npm package

export function isPathInside(childPath, parentPath) {
  const relation = relative(parentPath, childPath);

  return Boolean(
    relation &&
      relation !== '..' &&
      !relation.startsWith(`..${sep}`) &&
      relation !== resolve(childPath)
  );
}
