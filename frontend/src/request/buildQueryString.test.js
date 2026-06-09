import assert from 'node:assert/strict';
import test from 'node:test';

import { buildQueryString } from './buildQueryString.js';

test('returns an empty string when no options are provided', () => {
  assert.equal(buildQueryString(), '');
});

test('encodes reserved characters and preserves their values', () => {
  const queryString = buildQueryString({
    q: 'ACME & Sons + Partners #1',
    fields: 'name,email',
  });
  const searchParams = new URLSearchParams(queryString);

  assert.equal(searchParams.get('q'), 'ACME & Sons + Partners #1');
  assert.equal(searchParams.get('fields'), 'name,email');
  assert.match(queryString, /%26/);
  assert.match(queryString, /%2B/);
  assert.match(queryString, /%23/);
});

test('preserves falsy values and omits missing values', () => {
  const queryString = buildQueryString({
    page: 0,
    enabled: false,
    filter: undefined,
    equal: null,
  });
  const searchParams = new URLSearchParams(queryString);

  assert.equal(searchParams.get('page'), '0');
  assert.equal(searchParams.get('enabled'), 'false');
  assert.equal(searchParams.has('filter'), false);
  assert.equal(searchParams.has('equal'), false);
});
