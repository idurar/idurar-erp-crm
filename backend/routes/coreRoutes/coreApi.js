const express = require('express');
const multer = require('multer');
const path = require('path');
const setFilePathToBody = require('@/middlewares/setFilePathToBody');
const { catchErrors } = require('@/handlers/errorHandlers');

const router = express.Router();

const adminController = require('@/controllers/coreControllers/adminController');
const settingController = require('@/controllers/coreControllers/settingController');
const emailController = require('@/controllers/coreControllers/emailController');

const {
  uploadMultipleToStorage,
  createMultipleUpload,
  uploadSingleToStorage,
  createSingleUpload,
} = require('@/middlewares/uploadMiddleware');

const { hasPermission } = require('@/middlewares/permission');
// //_______________________________ Admin management_______________________________

var adminPhotoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/admin');
  },
  filename: function (req, file, cb) {
    console.log('🚀 ~ file: coreApi.js:28 ~ file:', file.originalname);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const adminPhotoUpload = multer({ storage: adminPhotoStorage });

router
  .route('/admin/create')
  .post(
    hasPermission(),
    [adminPhotoUpload.single('photo'), setFilePathToBody('photo')],
    catchErrors(adminController.create)
  );
router.route('/admin/read/:id').get(hasPermission('read'), catchErrors(adminController.read));
router
  .route('/admin/update/:id')
  .patch(
    hasPermission(),
    [adminPhotoUpload.single('photo'), setFilePathToBody('photo')],
    catchErrors(adminController.update)
  );
router.route('/admin/delete/:id').delete(hasPermission(), catchErrors(adminController.delete));
router.route('/admin/search').get(hasPermission('read'), catchErrors(adminController.search));
router.route('/admin/list').get(hasPermission('read'), catchErrors(adminController.list));
router.route('/admin/profile').get(hasPermission('read'), catchErrors(adminController.profile));
router.route('/admin/status/:id').patch(hasPermission('read'), catchErrors(adminController.status));
router
  .route('/admin/photo')
  .post(
    hasPermission(),
    [adminPhotoUpload.single('photo'), setFilePathToBody('photo')],
    catchErrors(adminController.photo)
  );
router
  .route('/admin/password-update/:id')
  .patch(hasPermission(), catchErrors(adminController.updatePassword));

router
  .route('/profile/update/:id')
  .patch(
    hasPermission('read'),
    adminPhotoUpload.single('file'),
    setFilePathToBody('photo'),
    catchErrors(adminController.updateProfile)
  );

// //____________________________________________ API for Global Setting _________________

router
  .route('/setting/create')
  .post(hasPermission('create'), catchErrors(settingController.create));
router.route('/setting/read/:id').get(hasPermission('read'), catchErrors(settingController.read));
router
  .route('/setting/update/:id')
  .patch(hasPermission('update'), catchErrors(settingController.update));
//router.route('/setting/delete/:id).delete(hasPermission(),catchErrors(settingController.delete));
router.route('/setting/search').get(hasPermission('read'), catchErrors(settingController.search));
router.route('/setting/list').get(hasPermission('read'), catchErrors(settingController.list));
router.route('/setting/listAll').get(hasPermission('read'), catchErrors(settingController.listAll));
router.route('/setting/filter').get(hasPermission('read'), catchErrors(settingController.filter));
router
  .route('/setting/readBySettingKey/:settingKey')
  .get(hasPermission('read'), catchErrors(settingController.readBySettingKey));
router
  .route('/setting/listBySettingKey')
  .get(hasPermission('read'), catchErrors(settingController.listBySettingKey));
router
  .route('/setting/updateBySettingKey/:settingKey?')
  .patch(hasPermission('update'), catchErrors(settingController.updateBySettingKey));
router
  .route('/setting/updateManySetting')
  .patch(hasPermission('read'), catchErrors(settingController.updateManySetting));

// //____________________________________________ API for Email Templates _________________
router.route('/email/create').post(hasPermission('create'), catchErrors(emailController.create));
router.route('/email/read/:id').get(hasPermission('read'), catchErrors(emailController.read));
router
  .route('/email/update/:id')
  .patch(hasPermission('update'), catchErrors(emailController.update));
router.route('/email/search').get(hasPermission('read'), catchErrors(emailController.search));
router.route('/email/list').get(hasPermission('read'), catchErrors(emailController.list));
router.route('/email/listAll').get(hasPermission('read'), catchErrors(emailController.listAll));
router.route('/email/filter').get(hasPermission('read'), catchErrors(emailController.filter));

// //____________________________________________ API for Upload controller _________________

router.route('/multiple/upload/:model/:fieldId').post(
  hasPermission('upload'),
  uploadMultipleToStorage.array('upload', 100),
  createMultipleUpload,
  // need to add proper controller
  hasPermission(),
  catchErrors((req, res) => {
    if (req.upload.files) {
      return res.status(200).send({
        success: true,
        result: req.upload.files,
        message: 'File uploaded successfully!',
      });
    }
  })
);

router.route('/single/upload/:model/:fieldId').post(
  hasPermission('upload'),
  uploadSingleToStorage.single('upload'),
  createSingleUpload,
  // need to add proper controller
  hasPermission(),
  catchErrors((req, res) => {
    if (req.upload && req.file) {
      return res.status(200).send({
        success: true,
        result: req.upload,
        message: 'File uploaded successfully!',
      });
    }
  })
);

module.exports = router;
