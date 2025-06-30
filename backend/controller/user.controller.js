import { User } from "../models/index.js";
import sendError from "../utils/sendError.util.js";
import passport from "passport";

const userLogout = (req, res, next) => {
  return req.logout((err) => {
    if (err) return next(err);
    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logout successfully." });
    });
  });
};

const userSignUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return next(sendError("All fields are required.", 400));
    const userExists = await User.findOne({ username });
    if (userExists) {
      return next(sendError("User already exist", 400));
    }
    const newUser = new User({ username, email, password });
    await newUser.save();
    return res.status(201).json({ message: "New user added successfully." });
  } catch (error) {
    return next(error);
  }
};
const postProfile = (req, res) => {
  return res.status(200).json({ message: `hello ${req.user.username}` });
};

const postLogin =  (req, res, next) => {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res
        .status(401)
        .json({ message: info?.message || "user does not exist" });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json({
        message: "logged in successfully",
        user: { username: req.user.username, email: req.user.email },
      });
    })
  })(req, res, next);
}

const getProfile = (req, res, next) => {
  try {
    const { username, email } = req.user;
    return res.status(200).json({ email, username });
  } catch (error) {
    return next(error);
  }
}

const putProfile = async (req, res, next) => {
  try {
    const { username, email, oldPassword, newPassword } = req.body;

    const updated = await User.findById(req.user._id);
    if (oldPassword && newPassword) {
      const isMatch = await updated.verifyPassword(oldPassword);
      console.log(isMatch)
      if (!isMatch)
        return next(sendError("password does not match",401));
      updated.password = newPassword;
    }
    if (username !== updated.username) updated.username = username;
    if (email!== updated.email) updated.email = email;

    await updated.save();
    return res
      .status(200)
      .json({ message: "updated successfully", user: { username:updated.username, email:updated.email } });
  } catch (error) {
    next(error);
  }
}
export { userLogout, userSignUp, postProfile,postLogin ,getProfile,putProfile};
