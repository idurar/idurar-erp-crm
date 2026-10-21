const express = require('express');
const rateLimit = require('express-rate-limit');
const { catchErrors } = require('@/handlers/errorHandlers');
const licenseController = require('@/controllers/coreControllers/licenseController');

const router = express.Router();
const activationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Zu viele Aktivierungsversuche. Bitte später erneut versuchen.' },
});

router.get('/status', catchErrors(licenseController.status));
router.post('/activate', activationLimiter, catchErrors(licenseController.activate));

module.exports = router;
