const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

const appController = require("../controllers/appController");
const { catchErrors } = require("../handlers/errorHandlers");
const {
  isLoggedIn,
  alreadyLoggedIn,
  login,
  redirect,
} = require("../controllers/authController");

router.route("/login").get(alreadyLoggedIn, appController.login);
router.route("/login").post(catchErrors(login));
router.route("/redirectAfterLogin").get(redirect);
router
  .route("/logout")
  .post(isLoggedIn, catchErrors(authController.logout))
  .get(isLoggedIn, catchErrors(authController.logout));

module.exports = router;
