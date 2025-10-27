const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const { User } = require("../models");

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email =
          profile.emails && profile.emails[0] ? profile.emails[0].value : null;

        if (!email) {
          return done(new Error("No email found from GitHub"), null);
        }

        let user = await User.findOne({ githubId: profile.id });

        if (user) {
          return done(null, user);
        }

        user = await User.findOne({ email });

        if (user) {
          user.githubId = profile.id;
          user.avatarUrl =
            profile.photos && profile.photos[0] ? profile.photos[0].value : "";
          await user.save();
          return done(null, user);
        }

        const newUser = new User({
          githubId: profile.id,
          username: profile.username,
          email,
          avatarUrl:
            profile.photos && profile.photos[0] ? profile.photos[0].value : "",
        });

        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
