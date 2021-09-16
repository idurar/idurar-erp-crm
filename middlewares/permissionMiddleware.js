const permission = require("../models/Permission");

const HasPermission = (perm) => {
  return async (req, res, next) => {
    let session = req;
    let permis;
    // if the session is missing redirect the admin to the login page
    if (session.admin == undefined) {
      return res.send({
        status: false,
        message: "Unauthorized",
      });
    }
    try {
      // Get the permissions request from the routes middleware from the database
      permis = await permission.findOne({ name: perm });
    } catch (err) {
      // If any thing goes wrong return permission denied, for security reasons
      return res.send({
        status: false,
        message: "You do not have permission for this action",
      });
    }
    //check if permission exists in database
    if (permis && session.admin) {
      // if yes => check if the admin has it
      if (session.admin.permissions.includes(String(permis._id))) {
        next();
      } else {
        return res.send({
          status: false,
          message: "You do not have permission for this action",
        });
      }
    } else {
      // else we are going to return to the admin that he does not have the permission to do this action
      return res.send({
        status: false,
        message: "You do not have permission for this action",
      });
    }
  };
};

module.exports = HasPermission;
