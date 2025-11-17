const express = require('express');
const router = express.Router();

const createAuthMiddleware = require('../../controllers/middlewaresControllers/createAuthMiddleware');
const Admin = require('@/models/coreModels/Admin');

// Initialize middleware with Admin model
const authMiddleware = createAuthMiddleware(Admin);

const { catchErrors } = require('@/handlers/errorHandlers');
const adminAuth = require('@/controllers/coreControllers/adminAuth');

// LOGIN - MUST NOT REQUIRE TOKEN
router.post('/login', authMiddleware.login);

// Forgot & Reset Password
router.post('/forgetpassword', catchErrors(adminAuth.forgetPassword));
router.post('/resetpassword', catchErrors(adminAuth.resetPassword));

// Refresh Token (Allowed w/Refresh Token)
router.post('/refresh-token', authMiddleware.refreshToken);

// Logout (requires authentication)
router.post('/logout', adminAuth.isValidAuthToken, catchErrors(adminAuth.logout));

module.exports = router;
