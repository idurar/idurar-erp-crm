const express = require('express');

const router = express.Router();

const { catchErrors } = require('@/handlers/errorHandlers');
const adminAuth = require('@/controllers/coreControllers/adminAuth');
const googleAuth = require('@/controllers/coreControllers/adminAuth/googleAuth');

router.route('/register').post(catchErrors(adminAuth.register));

router.route('/login').post(catchErrors(adminAuth.login));

router.route('/google').post(catchErrors(adminAuth.googleAuth));

router.route('/forgetpassword').post(catchErrors(adminAuth.forgetPassword));
router.route('/resetpassword').post(catchErrors(adminAuth.resetPassword));

router.route('/logout').post(adminAuth.isValidAuthToken, catchErrors(adminAuth.logout));

// Google OAuth login route
router.route('/google').post(catchErrors(googleAuth));

module.exports = router;
