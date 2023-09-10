const express = require('express');
const router = express.Router();

const { catchErrors } = require('@/handlers/errorHandlers');
const { uploadFileData, upload } = require('@/middlewares/middlewaresControllers/uploadController');



//___________________________________________________Routes For file upload________________________________________

// public file upload route
router.route('/public/upload/:model/:fieldId').post(
  (req, res, next) => {
    req.isPublic = true;
    next();
  },
  upload.single('file'),
  catchErrors(uploadFileData)
);
// Private file upload route
router.route('/private/upload/:model/:fieldId').post(
  (req, res, next) => {
    req.isPublic = false;
    next();
  },
  upload.single('file'),
  catchErrors(uploadFileData)
);

module.exports = router;