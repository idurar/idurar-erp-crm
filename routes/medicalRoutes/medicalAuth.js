const express = require('express');

const router = express.Router();

const { catchErrors } = require('@/handlers/errorHandlers');
const {
  isValidAdminToken,
  login,
  logout,
} = require('@/controllers/erpControllers/authJwtController ');

router.route('/login').post(catchErrors(login));
router.route('/logout').post(isValidAdminToken, catchErrors(logout));

module.exports = router;
