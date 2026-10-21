export const categoryId = (value) => String(value?._id || value || '');

export const getCategoryPath = (category, categories) => {
  if (!category) return [];
  const byId = new Map(categories.map((item) => [categoryId(item), item]));
  const path = [];
  const visited = new Set();
  let current = category;

  while (current && !visited.has(categoryId(current))) {
    visited.add(categoryId(current));
    path.unshift(current.name);
    current = byId.get(categoryId(current.parent));
  }

  return path;
};

export const getCategoryOptions = (categories, excludedIds = new Set()) => categories
  .filter((category) => !excludedIds.has(categoryId(category)))
  .map((category) => ({
    value: category._id,
    label: getCategoryPath(category, categories).join(' › '),
  }))
  .sort((a, b) => a.label.localeCompare(b.label, 'de'));

export const getCategoryDescendantIds = (category, categories) => {
  const descendants = new Set();
  const pending = [categoryId(category)];

  while (pending.length) {
    const parentId = pending.pop();
    categories.forEach((item) => {
      const id = categoryId(item);
      if (categoryId(item.parent) === parentId && !descendants.has(id)) {
        descendants.add(id);
        pending.push(id);
      }
    });
  }

  return descendants;
};

export const sortCategoriesByHierarchy = (categories) => {
  const byParent = new Map();
  const knownIds = new Set(categories.map(categoryId));

  categories.forEach((category) => {
    const parentId = categoryId(category.parent);
    const key = knownIds.has(parentId) ? parentId : '';
    byParent.set(key, [...(byParent.get(key) || []), category]);
  });

  byParent.forEach((items) => items.sort((a, b) => a.name.localeCompare(b.name, 'de')));
  const result = [];
  const visited = new Set();
  const append = (parentId, depth) => {
    (byParent.get(parentId) || []).forEach((category) => {
      const id = categoryId(category);
      if (visited.has(id)) return;
      visited.add(id);
      result.push({ ...category, hierarchyDepth: depth });
      append(id, depth + 1);
    });
  };
  append('', 0);
  categories.forEach((category) => {
    if (!visited.has(categoryId(category))) append(categoryId(category.parent), 0);
  });
  return result;
};
