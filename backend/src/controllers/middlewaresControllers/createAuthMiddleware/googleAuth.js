const mongoose = require('mongoose');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const googleAuth = ({ app, userModel }) => {
  const UserModel = mongoose.model(userModel);
  const UserPasswordModel = mongoose.model(userModel + 'Password');

  // Configure Google OAuth strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.API_URL}/api/auth/google/callback`,
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          // Check if the user already exists
          let user = await UserModel.findOne({ 
            email: profile.emails[0].value,
            removed: false 
          });

          // If user doesn't exist, create a new one
          if (!user) {
            user = new UserModel({
              email: profile.emails[0].value,
              name: profile.displayName,
              googleId: profile.id,
              enabled: true,
              isActive: true,
              removed: false,
            });
            await user.save();

            // Create a random password for the user (they won't use it)
            const passwordHash = await UserPasswordModel.generateHash(Math.random().toString(36).slice(-8));

            const userPassword = new UserPasswordModel({
              user: user._id,
              password: passwordHash,
              removed: false,
            });

            await userPassword.save();
          } else if (!user.googleId) {
            // If user exists but doesn't have googleId (registered with email)
            user.googleId = profile.id;
            await user.save();
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  // Initialize passport
  app.use(passport.initialize());

  // Google auth routes
  app.get(
    '/api/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  app.get(
    '/api/auth/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    (req, res) => {
      // Generate JWT token
      const token = req.user.generateToken();

      // Set cookie with token
      res.cookie('token', token, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });

      // Redirect to frontend
      res.redirect(`${process.env.FRONTEND_URL}/login?googleauth=success`);
    }
  );
};

module.exports = googleAuth; 
