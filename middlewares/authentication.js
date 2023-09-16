const { checkIfAllowedAccess } = require("@/helpers");

exports.authenticate = (req, res, next) => {
  try{
    const { permissions }  = req.admin;
    const permissionsJSON = JSON.parse(permissions)
    // path - on which route are we hitting
    const path = req.originalUrl.split('/')[2];
    // method - which operation(GET,POST,PATCH,DELETE) we are performing
    const method = req.method;
    if(!checkIfAllowedAccess(method, permissionsJSON[path])) {
      return res.status(401).json({
        success: false,
        result: null,
        message: 'Don\'t have permissions to perform this action, authorization denied.',
      });
    };
    next();
  }catch(e){
    console.log(e);
    return res.status(500).json({
        success: false,
        result: null,
        message: 'Some error Occured. Please try again.',
      });
  }
}