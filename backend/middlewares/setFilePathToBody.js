//this middleware will check if the admin  is logged in, if not he will be redirected to the login page :)
module.exports = (req, res, next) => {
  if (req.file) {
    req.body[req.file.fieldname] = req.file.path.replace('public/', '');
  }
  // if (req.files) {
  //     req.body[req.files.fieldname] = req.files.path
  // }
  next();
};
