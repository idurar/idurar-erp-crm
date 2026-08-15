const express = require('express');
const { catchErrors } = require('@/handlers/errorHandlers');
const router = express.Router();

const authController = require('@/controllers/authController');

router.post('/register', catchErrors(authController.register));
router.post('/login', catchErrors(authController.login));

module.exports = router;
