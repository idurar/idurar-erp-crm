// load all the things we need
var LocalStrategy = require("passport-local").Strategy;
var FacebookStrategy = require("passport-facebook").Strategy;
var TwitterStrategy = require("passport-twitter").Strategy;
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

// load up the admin model
const mongoose = require("mongoose");
let Admin = mongoose.model("Admin");

// load the auth variables
var configAuth = require("./auth"); // use this one for testing

module.exports = function (passport) {
  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize admins out of session

  // used to serialize the admin for the session
  passport.serializeUser(function (admin, done) {
    done(null, admin.id);
  });

  // used to deserialize the admin
  passport.deserializeUser(function (id, done) {
    Admin.findById(id, function (err, admin) {
      done(err, admin);
    });
  });

  // =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================
  passport.use(
    "local-login",
    new LocalStrategy(
      {
        // by default, local strategy uses adminname and password, we will override with email
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true, // allows us to pass in the req from our route (lets us check if a admin is logged in or not)
      },
      function (req, email, password, done) {
        if (email) email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function () {
          Admin.findOne({ email: email, removed: false }, async function (
            err,
            admin
          ) {
            // if there are any errors, return the error
            if (err) return done(err);

            // if no admin is found, return the message
            if (!admin)
              return done(null, false, req.flash("error", "No admin found."));
            const isMatch = await admin.validPassword(password);
            if (!isMatch)
              return done(
                null,
                false,
                req.flash("error", "Oops! Wrong password.")
              );
            // all is well, return admin
            else return done(null, admin);
          });
        });
      }
    )
  );

  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        // by default, local strategy uses adminname and password, we will override with email
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true, // allows us to pass in the req from our route (lets us check if a admin is logged in or not)
      },
      function (req, email, password, done) {
        if (email) email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function () {
          // if the admin is not already logged in:
          if (!req.admin) {
            Admin.findOne({ "local.email": email }, function (err, admin) {
              // if there are any errors, return the error
              if (err) return done(err);

              // check to see if theres already a admin with that email
              if (admin) {
                return done(
                  null,
                  false,
                  req.flash("signupMessage", "That email is already taken.")
                );
              } else {
                // create the admin
                var newAdmin = new Admin();

                newAdmin.local.email = email;
                newAdmin.local.password = newAdmin.generateHash(password);

                newAdmin.save(function (err) {
                  if (err) return done(err);

                  return done(null, newAdmin);
                });
              }
            });
            // if the admin is logged in but has no local account...
          } else if (!req.admin.local.email) {
            // ...presumably they're trying to connect a local account
            // BUT let's check if the email used to connect a local account is being used by another admin
            Admin.findOne({ "local.email": email }, function (err, admin) {
              if (err) return done(err);

              if (admin) {
                return done(
                  null,
                  false,
                  req.flash("loginMessage", "That email is already taken.")
                );
                // Using 'loginMessage instead of signupMessage because it's used by /connect/local'
              } else {
                let admin = req.admin;
                admin.local.email = email;
                admin.local.password = admin.generateHash(password);
                admin.save(function (err) {
                  if (err) return done(err);

                  return done(null, admin);
                });
              }
            });
          } else {
            // admin is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, admin!)
            return done(null, req.admin);
          }
        });
      }
    )
  );

  // =========================================================================
  // FACEBOOK ================================================================
  // =========================================================================
  var fbStrategy = configAuth.facebookAuth;
  fbStrategy.passReqToCallback = true; // allows us to pass in the req from our route (lets us check if a admin is logged in or not)
  passport.use(
    new FacebookStrategy(fbStrategy, function (
      req,
      token,
      refreshToken,
      profile,
      done
    ) {
      // asynchronous
      process.nextTick(function () {
        // check if the admin is already logged in
        if (!req.admin) {
          Admin.findOne({ "facebook.id": profile.id }, function (err, admin) {
            if (err) return done(err);

            if (admin) {
              // if there is a admin id already but no token (admin was linked at one point and then removed)
              if (!admin.facebook.token) {
                admin.facebook.token = token;
                admin.facebook.name =
                  profile.name.givenName + " " + profile.name.familyName;
                admin.facebook.email = (
                  profile.emails[0].value || ""
                ).toLowerCase();

                admin.save(function (err) {
                  if (err) return done(err);

                  return done(null, admin);
                });
              }

              return done(null, admin); // admin found, return that admin
            } else {
              // if there is no admin, create them
              var newAdmin = new Admin();

              newAdmin.facebook.id = profile.id;
              newAdmin.facebook.token = token;
              newAdmin.facebook.name =
                profile.name.givenName + " " + profile.name.familyName;
              newAdmin.facebook.email = (
                profile.emails[0].value || ""
              ).toLowerCase();

              newAdmin.save(function (err) {
                if (err) return done(err);

                return done(null, newAdmin);
              });
            }
          });
        } else {
          // admin already exists and is logged in, we have to link accounts
          var admin = req.admin; // pull the admin out of the session

          admin.facebook.id = profile.id;
          admin.facebook.token = token;
          admin.facebook.name =
            profile.name.givenName + " " + profile.name.familyName;
          admin.facebook.email = (profile.emails[0].value || "").toLowerCase();

          admin.save(function (err) {
            if (err) return done(err);

            return done(null, admin);
          });
        }
      });
    })
  );

  // =========================================================================
  // TWITTER =================================================================
  // =========================================================================
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: configAuth.twitterAuth.consumerKey,
        consumerSecret: configAuth.twitterAuth.consumerSecret,
        callbackURL: configAuth.twitterAuth.callbackURL,
        passReqToCallback: true, // allows us to pass in the req from our route (lets us check if a admin is logged in or not)
      },
      function (req, token, tokenSecret, profile, done) {
        // asynchronous
        process.nextTick(function () {
          // check if the admin is already logged in
          if (!req.admin) {
            Admin.findOne({ "twitter.id": profile.id }, function (err, admin) {
              if (err) return done(err);

              if (admin) {
                // if there is a admin id already but no token (admin was linked at one point and then removed)
                if (!admin.twitter.token) {
                  admin.twitter.token = token;
                  admin.twitter.adminname = profile.adminname;
                  admin.twitter.displayName = profile.displayName;

                  admin.save(function (err) {
                    if (err) return done(err);

                    return done(null, admin);
                  });
                }

                return done(null, admin); // admin found, return that admin
              } else {
                // if there is no admin, create them
                var newAdmin = new Admin();

                newAdmin.twitter.id = profile.id;
                newAdmin.twitter.token = token;
                newAdmin.twitter.adminname = profile.adminname;
                newAdmin.twitter.displayName = profile.displayName;

                newAdmin.save(function (err) {
                  if (err) return done(err);

                  return done(null, newAdmin);
                });
              }
            });
          } else {
            // admin already exists and is logged in, we have to link accounts
            var admin = req.admin; // pull the admin out of the session

            admin.twitter.id = profile.id;
            admin.twitter.token = token;
            admin.twitter.adminname = profile.adminname;
            admin.twitter.displayName = profile.displayName;

            admin.save(function (err) {
              if (err) return done(err);

              return done(null, admin);
            });
          }
        });
      }
    )
  );

  // =========================================================================
  // GOOGLE ==================================================================
  // =========================================================================
  passport.use(
    new GoogleStrategy(
      {
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL,
        passReqToCallback: true, // allows us to pass in the req from our route (lets us check if a admin is logged in or not)
      },
      function (req, token, refreshToken, profile, done) {
        // asynchronous
        process.nextTick(function () {
          // check if the admin is already logged in
          if (!req.admin) {
            Admin.findOne({ "google.id": profile.id }, function (err, admin) {
              if (err) return done(err);

              if (admin) {
                // if there is a admin id already but no token (admin was linked at one point and then removed)
                if (!admin.google.token) {
                  admin.google.token = token;
                  admin.google.name = profile.displayName;
                  admin.google.email = (
                    profile.emails[0].value || ""
                  ).toLowerCase(); // pull the first email

                  admin.save(function (err) {
                    if (err) return done(err);

                    return done(null, admin);
                  });
                }

                return done(null, admin);
              } else {
                var newAdmin = new Admin();

                newAdmin.google.id = profile.id;
                newAdmin.google.token = token;
                newAdmin.google.name = profile.displayName;
                newAdmin.google.email = (
                  profile.emails[0].value || ""
                ).toLowerCase(); // pull the first email

                newAdmin.save(function (err) {
                  if (err) return done(err);

                  return done(null, newAdmin);
                });
              }
            });
          } else {
            // admin already exists and is logged in, we have to link accounts
            var admin = req.admin; // pull the admin out of the session

            admin.google.id = profile.id;
            admin.google.token = token;
            admin.google.name = profile.displayName;
            admin.google.email = (profile.emails[0].value || "").toLowerCase(); // pull the first email

            admin.save(function (err) {
              if (err) return done(err);

              return done(null, admin);
            });
          }
        });
      }
    )
  );
};
