import { User } from "../models/index.js";
import sendError from "../utils/sendError.util.js";

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
// const putProfile =

export { userLogout, userSignUp, postProfile };
