const express = require('express');
const multer = require('multer');
const path = require('path');
const setFilePathToBody = require('@/middlewares/setFilePathToBody');
const { catchErrors } = require('@/handlers/errorHandlers');

const router = express.Router();

const adminController = require('@/controllers/coreControllers/adminController');
const roleController = require('@/controllers/erpControllers/roleController');

// //_______________________________ Admin management_______________________________

var adminPhotoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/admin');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const adminPhotoUpload = multer({ storage: adminPhotoStorage });

router
  .route('/admin/create')
  .post([adminPhotoUpload.single('photo'), setFilePathToBody], catchErrors(adminController.create));
router.route('/admin/read/:id').get(catchErrors(adminController.read));
// router.route("/admin/update/:id").patch(catchErrors(adminController.update));
// router.route("/admin/delete/:id").delete(catchErrors(adminController.delete));
router.route('/admin/search').get(catchErrors(adminController.search));
router.route('/admin/list').get(catchErrors(adminController.list));
router.route('/admin/profile').get(catchErrors(adminController.profile));
router.route('/admin/status/:id').patch(catchErrors(adminController.status));
// router
//   .route("/admin/photo")
//   .post(
//     [adminPhotoUpload.single("photo"), setFilePathToBody],
//     catchErrors(adminController.photo)
//   );
// router
//   .route("/admin/password-update/:id")
//   .patch(catchErrors(adminController.updatePassword));

// //____________________________ Role management_______________________________

router.route('/role/create').post(catchErrors(roleController.create));
router.route('/role/read/:id').get(catchErrors(roleController.read));
router.route('/role/update/:id').patch(catchErrors(roleController.update));
router.route('/role/delete/:id').delete(catchErrors(roleController.delete));
router.route('/role/search').get(catchErrors(roleController.search));
router.route('/role/list').get(catchErrors(roleController.list));
router.route('/role/filter').get(catchErrors(roleController.filter));

module.exports = router;
