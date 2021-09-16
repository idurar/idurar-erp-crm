const passport = require("passport");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Admin = mongoose.model("Admin");
const promisify = require("es6-promisify");
const mail = require("../handlers/mail");

exports.login = passport.authenticate("local-login", {
  successRedirect: "/redirectAfterLogin",
  failureRedirect: "/login", // redirect back to the signup page if there is an error
  failureFlash: true, // allow flash messages
});
exports.redirect = function (req, res) {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  let staff = JSON.parse(JSON.stringify(req.admin));
  if (req.body.remember) {
    req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
  } else {
    req.session.cookie.expires = false; // Cookie expires at end of session
  }

  switch (staff.role.dashboardType) {
    case "admin":
      return res.redirect("/consultation/5f9dab87012603af2f0a6d01");
    // break;
    case "doctor":
      return res.redirect("/patient");
    // break;
    case "secritary":
      return res.redirect("/appointment");
    // break;
    default:
      return res.redirect("/admin");
  }
};

exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "You are now logged out! 👋");
  res.redirect("/login");
};

exports.checkAuth = (req, res, next) => {
  // first check if the admin is authenticated
  if (req.isAuthenticated()) {
    next(); // carry on! They are logged in!
  } else {
    return res
      .status(401)
      .json({ error: "you must be logged in , authorization denied." });
  }
};

exports.isLoggedIn = (req, res, next) => {
  // first check if the admin is authenticated
  if (req.isAuthenticated()) {
    next(); // carry on! They are logged in!
  } else {
    req.flash("error", "Oops you must be logged in to do that!");
    res.redirect("/login");
  }
};

exports.alreadyLoggedIn = (req, res, next) => {
  // first check if the admin is authenticated
  if (req.isAuthenticated()) {
    req.flash("info", "you are already LoggedIn");
    res.redirect("/"); // carry on! They are logged in!
  } else {
    next();
  }
};
exports.forgot = async (req, res) => {
  // 1. See if a admin with that email exists
  const admin = await Admin.findOne({ email: req.body.email });
  if (!admin) {
    req.flash("error", "No account with that email exists.");
    return res.redirect("/login");
  }
  // 2. Set reset tokens and expiry on their account
  admin.resetPasswordToken = crypto.randomBytes(20).toString("hex");
  admin.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
  await admin.save();
  // 3. Send them an email with the token
  const resetURL = `http://${req.headers.host}/account/reset/${admin.resetPasswordToken}`;
  await mail.send({
    admin,
    filename: "password-reset",
    subject: "Password Reset",
    resetURL,
  });
  req.flash("success", `You have been emailed a password reset link.`);
  // 4. redirect to login page
  res.redirect("/login");
};

exports.reset = async (req, res) => {
  const admin = await Admin.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!admin) {
    req.flash("error", "Password reset is invalid or has expired");
    return res.redirect("/login");
  }
  // if there is a admin, show the rest password form
  res.render("reset", { title: "Reset your Password" });
};

exports.confirmedPasswords = (req, res, next) => {
  if (req.body.password === req.body["password-confirm"]) {
    next(); // keepit going!
    return;
  }
  req.flash("error", "Passwords do not match!");
  res.redirect("back");
};

exports.update = async (req, res) => {
  const admin = await Admin.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!admin) {
    req.flash("error", "Password reset is invalid or has expired");
    return res.redirect("/login");
  }

  const setPassword = promisify(admin.setPassword, admin);
  await setPassword(req.body.password);
  admin.resetPasswordToken = undefined;
  admin.resetPasswordExpires = undefined;
  const updatedAdmin = await admin.save();
  await req.login(updatedAdmin);
  req.flash(
    "success",
    "💃 Nice! Your password has been reset! You are now logged in!"
  );
  res.redirect("/");
};
