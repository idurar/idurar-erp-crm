const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// add the register route
router.post('/register', authController.registerUser);

module.exports = router;
