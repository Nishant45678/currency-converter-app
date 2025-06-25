import { Router } from "express";
import {
  getProfile,
  postLogin,
  postProfile,
  putProfile,
  userLogout,
  userSignUp,
} from "../controller/user.controller.js";
import { isAuthenticated } from "../middleware/index.js";


const router = Router();

router.post("/signup", userSignUp);

router.post("/login",postLogin);

router.get("/logout", userLogout);

router.post("/profile", isAuthenticated, postProfile);

router.get("/profile", isAuthenticated, getProfile);

router.put("/profile", isAuthenticated, putProfile);

export { router as userRoute };
