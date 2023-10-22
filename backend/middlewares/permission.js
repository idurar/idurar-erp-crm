//this middleware will check if the user has permission

const roles = {
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
      console.log('🚀 ~ file: permission.js:25 ~ return ~ permissionName:', permissionName);
      next();
    } else {
      return res.status(403).json({
        success: false,
        result: null,
        message: 'You dont have permission , Permission denied.',
      });
    }
  };
};
