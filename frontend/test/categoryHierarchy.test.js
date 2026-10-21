import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getCategoryDescendantIds,
  getCategoryOptions,
  sortCategoriesByHierarchy,
} from '../src/utils/categoryHierarchy.js';
import { htmlToPlainText } from '../src/utils/plainText.js';

const categories = [
  { _id: 'roller', name: 'Rollladen' },
  { _id: 'shaft', name: 'Rollladenwelle', parent: 'roller' },
  { _id: 'gear', name: 'Rollladen Getriebe', parent: 'roller' },
  { _id: 'motor', name: 'Motor', parent: 'gear' },
];

test('category options contain their complete hierarchy path', () => {
  assert.deepEqual(getCategoryOptions(categories), [
    { value: 'roller', label: 'Rollladen' },
    { value: 'gear', label: 'Rollladen › Rollladen Getriebe' },
    { value: 'motor', label: 'Rollladen › Rollladen Getriebe › Motor' },
    { value: 'shaft', label: 'Rollladen › Rollladenwelle' },
  ]);
});

test('category descendants include all nested levels', () => {
  assert.deepEqual(
    [...getCategoryDescendantIds(categories[0], categories)].sort(),
    ['gear', 'motor', 'shaft']
  );
});

test('hierarchy sorting remains finite for invalid cyclic legacy data', () => {
  const cyclic = [
    { _id: 'a', name: 'A', parent: 'b' },
    { _id: 'b', name: 'B', parent: 'a' },
  ];
  const sorted = sortCategoriesByHierarchy(cyclic);
  assert.equal(sorted.length, 2);
  assert.deepEqual(new Set(sorted.map((item) => item._id)), new Set(['a', 'b']));
});

test('legacy rich text descriptions are rendered as safe plain text', () => {
  assert.equal(
    htmlToPlainText('<p>Rollladen &amp; Motor</p><script>alert(1)</script><p>Zweite Zeile</p>'),
    'Rollladen & Motor\nZweite Zeile'
  );
});
