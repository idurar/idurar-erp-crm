//this middleware will check if the admin  is logged in, if not he will be redirected to the login page :)
module.exports = (fieldName = 'filePath') => {
  return (req, res, next) => {
    if (req.file) {
      req.body[fieldName] = req.file.path;
    }
    // if (req.files) {
    //     req.body[req.files.fieldName] = req.files.path
    // }
    next();
  };
};
