//this middleware will check if the admin  is logged in, if not he will be redirected to the login page :)
module.exports = (req, res, next) => {
  console.log('🚀 ~ file: setFilePathToBody.js:4 ~ req.file:', req.file);
  if (req.file) {
    req.body.photo = req.file.path;
    console.log('🚀 ~ file: setFilePathToBody.js:6 ~ req.file.path:', req.file.path);
  }
  // if (req.files) {
  //     req.body[req.files.fieldname] = req.files.path
  // }
  next();
};
