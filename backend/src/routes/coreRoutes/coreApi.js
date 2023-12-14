const express = require('express');

const { catchErrors } = require('@/handlers/errorHandlers');

const router = express.Router();

const adminController = require('@/controllers/coreControllers/adminController');
const settingController = require('@/controllers/coreControllers/settingController');
const emailController = require('@/controllers/coreControllers/emailController');

const { singleStorageUpload } = require('@/middlewares/uploadMiddleware');

const { hasPermission } = require('@/middlewares/permission');
// //_______________________________ Admin management_______________________________

router
  .route('/admin/create')
  .post(
    hasPermission(),
    singleStorageUpload({ entity: 'setting', fieldName: 'photo', fileType: 'image' }),
    catchErrors(adminController.create)
  );
router.route('/admin/read/:id').get(hasPermission('read'), catchErrors(adminController.read));
router
  .route('/admin/update/:id')
  .patch(
    hasPermission(),
    singleStorageUpload({ entity: 'setting', fieldName: 'photo', fileType: 'image' }),
    catchErrors(adminController.update)
  );
router.route('/admin/delete/:id').delete(hasPermission(), catchErrors(adminController.delete));
router.route('/admin/search').get(hasPermission(), catchErrors(adminController.search));
router.route('/admin/list').get(hasPermission(), catchErrors(adminController.list));
router.route('/admin/profile').get(hasPermission(), catchErrors(adminController.profile));
router.route('/admin/status/:id').patch(hasPermission(), catchErrors(adminController.status));
router
  .route('/admin/password-update/:id')
  .patch(hasPermission(), catchErrors(adminController.updatePassword));

//_______________________________ Admin Profile _______________________________

router
  .route('/admin/profile/password')
  .patch(hasPermission('update'), catchErrors(adminController.updateProfilePassword));
router
  .route('/admin/profile/update')
  .patch(
    hasPermission('update'),
    singleStorageUpload({ entity: 'admin', fieldName: 'photo', fileType: 'image' }),
    catchErrors(adminController.updateProfile)
  );

// //____________________________________________ API for Global Setting _________________

router.route('/setting/create').post(hasPermission(), catchErrors(settingController.create));
router.route('/setting/read/:id').get(hasPermission('read'), catchErrors(settingController.read));
router
  .route('/setting/update/:id')
  .patch(hasPermission('update'), catchErrors(settingController.update));
//router.route('/setting/delete/:id).delete(hasPermission(),catchErrors(settingController.delete));
router.route('/setting/search').get(hasPermission(), catchErrors(settingController.search));
router.route('/setting/list').get(hasPermission(), catchErrors(settingController.list));
router.route('/setting/listAll').get(hasPermission('read'), catchErrors(settingController.listAll));
router.route('/setting/filter').get(hasPermission(), catchErrors(settingController.filter));
router
  .route('/setting/readBySettingKey/:settingKey')
  .get(hasPermission('read'), catchErrors(settingController.readBySettingKey));
router
  .route('/setting/listBySettingKey')
  .get(hasPermission('read'), catchErrors(settingController.listBySettingKey));
router
  .route('/setting/updateBySettingKey/:settingKey?')
  .patch(hasPermission(), catchErrors(settingController.updateBySettingKey));
router
  .route('/setting/upload/:settingKey?')
  .patch(
    hasPermission(),
    singleStorageUpload({ entity: 'setting', fieldName: 'settingValue', fileType: 'image' }),
    catchErrors(settingController.updateBySettingKey)
  );
router
  .route('/setting/updateManySetting')
  .patch(hasPermission(), catchErrors(settingController.updateManySetting));

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

module.exports = router;
