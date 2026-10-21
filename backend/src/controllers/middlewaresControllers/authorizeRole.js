const { hasPermission, permissionForRequest } = require('@/security/permissions');

module.exports = (req, res, next) => {
  const permission = permissionForRequest(req);
  if (!permission || hasPermission(req.admin?.role, permission)) return next();

  return res.status(403).json({
    success: false,
    result: null,
    message: 'Sie haben keine Berechtigung für diese Aktion.',
    requiredPermission: permission,
  });
};
