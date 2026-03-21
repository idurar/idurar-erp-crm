const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
  JWT_SECRET,
  FRONTEND_URL
} = process.env;

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value;
    let user = await User.findOne({ googleId: profile.id }) || await User.findOne({ email });

    if (!user) {
      user = await User.create({
        googleId: profile.id,
        name: profile.displayName,
        email,
        avatar: profile.photos?.[0]?.value
      });
    } else if (!user.googleId) {
      user.googleId = profile.id;
      await user.save();
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const u = await User.findById(id);
    done(null, u);
  } catch (err) {
    done(err, null);
  }
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/failure` }),
  (req, res) => {
    const user = req.user;
    const payload = { id: user._id, name: user.name, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    const redirectUrl = `${FRONTEND_URL || 'http://localhost:3000'}/auth/success?token=${token}`;
    res.redirect(redirectUrl);
  }
);

router.get('/failure', (req, res) => {
  res.status(401).json({ success: false, message: 'Authentication failed' });
});

module.exports = router;
