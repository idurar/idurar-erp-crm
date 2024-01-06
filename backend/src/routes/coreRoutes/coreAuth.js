import express from 'express';
import { catchErrors } from '#handlers/errorHandlers';
import adminAuth from '#controllers/coreControllers/adminAuth/index.js';

const router = express.Router();

router.route('/login').post(catchErrors(adminAuth.login));
router.route('/register').post(catchErrors(adminAuth.register));
router.route('/verify/:userId/:emailToken').get(catchErrors(adminAuth.verify));
router.route('/forgetpassword').post(catchErrors(adminAuth.forgetPassword));
router.route('/resetpassword').post(catchErrors(adminAuth.resetPassword));
router.route('/verify/:userId/:emailToken').get(catchErrors(adminAuth.verify));
router.route('/logout').post(adminAuth.isValidAuthToken, catchErrors(adminAuth.logout));

export default router;
