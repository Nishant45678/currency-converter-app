import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../models/index.js";

passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect user!" });
      }
      if (!user.verifyPassword(password)) {
        return done(null, false, { message: "Incorrect password!" });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    return done(null, user);
  } catch (error) {
    done(error, null);
  }
});
