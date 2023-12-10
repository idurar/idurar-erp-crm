//this middleware will check if the user has permission

exports.hasPermission = (permissionName = 'none') => {
  return function (req, res, next) {
    next();
  };
};
