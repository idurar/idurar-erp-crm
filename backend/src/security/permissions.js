const ROLE_PERMISSIONS = Object.freeze({
  owner: ['*'],
  admin: ['settings:*', 'users:*', 'customers:*', 'sales:*', 'inventory:*', 'payments:*', 'projects:*', 'timeTracking:*', 'purchasing:*', 'expenses:*'],
  accounting: ['customers:read', 'sales:*', 'payments:*', 'projects:read', 'timeTracking:*', 'purchasing:*', 'expenses:*', 'settings:read'],
  sales: ['customers:*', 'sales:*', 'inventory:read', 'payments:read', 'projects:*', 'timeTracking:*', 'settings:read'],
  warehouse: ['customers:read', 'sales:read', 'inventory:*', 'projects:read', 'timeTracking:*', 'purchasing:*', 'expenses:read', 'settings:read'],
  technician: ['customers:read', 'sales:read', 'inventory:read', 'projects:*', 'timeTracking:*', 'settings:read'],
  viewer: ['customers:read', 'sales:read', 'inventory:read', 'payments:read', 'projects:read', 'timeTracking:*', 'settings:read'],
});

const entityArea = (path = '') => {
  if (/^\/(invoice|quote|orderconfirmation)(\/|$)/.test(path)) return 'sales';
  if (/^\/payment(\/|$)/.test(path)) return 'payments';
  if (/^\/(article|articlecategory|stockmovement|inventory)(\/|$)/.test(path)) return 'inventory';
  if (/^\/client(\/|$)/.test(path)) return 'customers';
  if (/^\/setting(\/|$)/.test(path)) return 'settings';
  if (/^\/admin(\/|$)/.test(path)) return 'users';
  if (/^\/audit(\/|$)/.test(path)) return 'users';
  if (/^\/project(\/|$)/.test(path)) return 'projects';
  if (/^\/timeentry(\/|$)/.test(path)) return 'timeTracking';
  if (/^\/(supplier|purchaseorder|goodsreceipt)(\/|$)/.test(path)) return 'purchasing';
  if (/^\/(expense|expensecategory)(\/|$)/.test(path)) return 'expenses';
  if (/^\/(taxes|paymentmode)(\/|$)/.test(path)) return 'settings';
  return null;
};

const operationForMethod = (method = 'GET') =>
  ['GET', 'HEAD', 'OPTIONS'].includes(method.toUpperCase()) ? 'read' : 'write';

const hasPermission = (role, permission) => {
  const granted = ROLE_PERMISSIONS[role] || [];
  const [area] = permission.split(':');
  return granted.includes('*') || granted.includes(permission) || granted.includes(`${area}:*`);
};

const permissionForRequest = (req) => {
  const area = entityArea(req.path);
  return `${area || 'unclassified'}:${operationForMethod(req.method)}`;
};

module.exports = { ROLE_PERMISSIONS, hasPermission, permissionForRequest };
