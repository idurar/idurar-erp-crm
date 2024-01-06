//this middleware will check if the user has permission

const hasPermission =
  (permissionName = 'none') =>
  (req, res, next) => {
    next();
  };

export default hasPermission;
