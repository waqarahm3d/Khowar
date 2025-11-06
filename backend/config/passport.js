const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user exists with this Google ID
          let user = await User.findOne({ authProviderId: profile.id, authProvider: 'google' });

          if (user) {
            return done(null, user);
          }

          // Check if user exists with this email
          user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            // Link Google account to existing user
            user.authProvider = 'google';
            user.authProviderId = profile.id;
            user.emailVerified = true;
            user.verifiedAt = new Date();
            await user.save();
            return done(null, user);
          }

          // Create new user
          const username = profile.emails[0].value.split('@')[0] + '_' + Date.now();

          user = await User.create({
            username,
            email: profile.emails[0].value,
            displayName: profile.displayName,
            profileImage: profile.photos[0]?.value || 'https://via.placeholder.com/150',
            authProvider: 'google',
            authProviderId: profile.id,
            emailVerified: true,
            verifiedAt: new Date(),
          });

          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
}

// Facebook Strategy
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ['id', 'emails', 'name', 'photos'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user exists with this Facebook ID
          let user = await User.findOne({ authProviderId: profile.id, authProvider: 'facebook' });

          if (user) {
            return done(null, user);
          }

          // Check if user exists with this email
          const email = profile.emails?.[0]?.value;

          if (email) {
            user = await User.findOne({ email });

            if (user) {
              // Link Facebook account to existing user
              user.authProvider = 'facebook';
              user.authProviderId = profile.id;
              user.emailVerified = true;
              user.verifiedAt = new Date();
              await user.save();
              return done(null, user);
            }
          }

          // Create new user
          const username = email
            ? email.split('@')[0] + '_' + Date.now()
            : 'user_' + Date.now();

          user = await User.create({
            username,
            email: email || `${profile.id}@facebook.com`,
            displayName: `${profile.name.givenName} ${profile.name.familyName}`,
            profileImage: profile.photos[0]?.value || 'https://via.placeholder.com/150',
            authProvider: 'facebook',
            authProviderId: profile.id,
            emailVerified: !!email,
            verifiedAt: email ? new Date() : null,
          });

          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
}

module.exports = passport;
