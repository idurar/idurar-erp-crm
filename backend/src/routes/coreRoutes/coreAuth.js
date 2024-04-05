const express = require('express');

const router = express.Router();

const { catchErrors } = require('@/handlers/errorHandlers');
const adminAuth = require('@/controllers/coreControllers/adminAuth');

// const rateLimit = require('express-rate-limit');

// // Set limits based on IP addresses
// const rateLimited = rateLimit({
//   windowMs: 60 * 1000 * 5, //  5 minute
//   max: 1, // Limit each IP to 100 requests per windowMs
//   //   message: 'Too many requests from this IP, please try again later in 5 minutes.',
// });

// const limiter = (req) => {
//   if (req.rateLimit.limit) {
//     return res.status(403).json({
//       success: false,
//       result: null,
//       message: 'Too many requests from this IP, please try again later.',
//     });
//   } else {
//     next();
//   }
// };

router.route('/login').post(catchErrors(adminAuth.login));

router.route('/forgetpassword').post(catchErrors(adminAuth.forgetPassword));
router.route('/resetpassword').post(catchErrors(adminAuth.resetPassword));

router.route('/logout').post(adminAuth.isValidAuthToken, catchErrors(adminAuth.logout));

module.exports = router;
