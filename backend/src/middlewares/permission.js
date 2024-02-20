//this middleware will check if the user has permission

const roles = {
  owner: ['create', 'read', 'update', 'delete', 'download', 'upload'],
  admin: ['admin', 'create', 'read', 'update', 'delete', 'download', 'upload'],
  manager: ['create', 'read', 'update', 'delete', 'download', 'upload'],
  employee: ['create', 'read', 'update', 'download', 'upload'],
  staff: ['create', 'read', 'update', 'download', 'upload'],
  create_only: ['create', 'read', 'download', 'upload'],
  read_only: ['read', 'download'],
};
exports.roles = roles;

exports.hasPermission = (permissionName = 'none') => {
  return function (req, res, next) {
    const currentUserRole = req.admin.role;

    if (
      roles[currentUserRole]?.includes(permissionName) ||
      req.admin.role === 'owner' ||
      req.admin.role === 'admin'
    ) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        result: null,
        message: 'Access denied : you are not granted permission.',
      });
    }
  };
};
