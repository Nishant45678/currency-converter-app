import { Router } from "express";
import passport from "passport";
import {
  postProfile,
  userLogout,
  userSignUp,
} from "../controller/user.controller.js";
import { isAuthenticated } from "../middleware/index.js";
import { User } from "../models/index.js";
import sendError from "../utils/sendError.util.js";

const router = Router();

router.post("/signup", userSignUp);

router.post("/login", (req, res, next) => {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res
        .status(401)
        .json({ message: info?.message || "invalid credentials" });
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
});

router.get("/logout", userLogout);

router.post("/profile", isAuthenticated, postProfile);

router.get("/profile", isAuthenticated, (req, res, next) => {
  try {
    const { username, email } = req.user;
    return res.status(200).json({ email, username });
  } catch (error) {
    return next(error);
  }
});

router.put("/profile", isAuthenticated, async (req, res, next) => {
  try {
    const { username, email, oldPassword, newPassword } = req.body;

    const updated = await User.findById(req.user._id);
    if (oldPassword && newPassword) {
      const isMatch = await updated.verifyPassword(oldPassword);
      if (!isMatch)
        return sendError("password does not match",401);
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
});

export { router as userRoute };
