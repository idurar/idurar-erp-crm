const test = require('node:test');
const assert = require('node:assert/strict');

const { hasPermission, permissionForRequest } = require('../src/security/permissions');

test('owner can perform every protected operation', () => {
  assert.equal(hasPermission('owner', 'users:write'), true);
  assert.equal(hasPermission('owner', 'inventory:write'), true);
});

test('viewer is read-only', () => {
  assert.equal(hasPermission('viewer', 'sales:read'), true);
  assert.equal(hasPermission('viewer', 'sales:write'), false);
});

test('warehouse can change inventory but not invoices', () => {
  assert.equal(hasPermission('warehouse', 'inventory:write'), true);
  assert.equal(hasPermission('warehouse', 'sales:write'), false);
});

test('request permissions are derived from method and resource', () => {
  assert.equal(permissionForRequest({ path: '/invoice/list', method: 'GET' }), 'sales:read');
  assert.equal(permissionForRequest({ path: '/invoice/create', method: 'POST' }), 'sales:write');
  assert.equal(
    permissionForRequest({ path: '/orderconfirmation/from-quote/123', method: 'POST' }),
    'sales:write'
  );
  assert.equal(permissionForRequest({ path: '/inventory/snapshot', method: 'GET' }), 'inventory:read');
  assert.equal(permissionForRequest({ path: '/timeentry/create', method: 'POST' }), 'timeTracking:write');
  assert.equal(hasPermission('viewer', 'timeTracking:write'), true);
});

test('new unclassified routes are denied by default for non-owners', () => {
  const permission = permissionForRequest({ path: '/future-module/create', method: 'POST' });
  assert.equal(permission, 'unclassified:write');
  assert.equal(hasPermission('admin', permission), false);
  assert.equal(hasPermission('owner', permission), true);
});
