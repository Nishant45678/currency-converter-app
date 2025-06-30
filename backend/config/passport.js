import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../models/index.js";
import bcrypt from "bcryptjs";


passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect user!" });
      }
      const match = await bcrypt.compare(password,user.password)
      if (!match) {
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
