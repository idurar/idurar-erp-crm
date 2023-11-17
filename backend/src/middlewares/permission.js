//this middleware will check if the user has permission

const roles = {
  admin: ['create', 'read', 'update', 'delete', 'download', 'upload'],
  staffAdmin: ['create', 'read', 'update', 'delete', 'download', 'upload'],
  staff: ['create', 'read', 'update', 'download', 'upload'],
  createOnly: ['create', 'read', 'download', 'upload'],
  readOnly: ['read', 'download'],
};
exports.roles = roles;
exports.hasPermission = (permissionName = 'all') => {
  return function (req, res, next) {
    const currentUserRole = req.admin.role;

    if (roles[currentUserRole].includes(permissionName) || req.admin.role === 'admin') {
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
