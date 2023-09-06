// coreRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { catchErrors } = require('@/handlers/errorHandlers');
const { uploadFileData } = '../../middlewares/middlewaresControllers/uploadController.js';


var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, `uploads/${req.modelName}`);
  },
  filename: function (request, file, callback) {
    if (request.newFileName) {
      // Check if the file exists in req
      return callback(null, request.newFileName);
    }
    return callback(null, false);
  },
});
var upload = multer({ storage: storage });

// public file upload route
router.route('/public/upload/:model/:fieldId').post(
  (req, res, next) => {
    req.isPublic = true;
    next();
  },
  uploadFileData,
  catchErrors(upload.single('file'))
);
// Private file upload route
router.route('/private/upload/:model/:fieldId').post(
  (req, res, next) => {
    req.isPublic = false;
    next();
  },
  uploadFileData,
  catchErrors(upload.single('file'))
);

module.exports = router;
