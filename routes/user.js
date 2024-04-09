import express from "express";
import {
  getCurrentUser,
  logOut,
  login,
  signUp,
  updateUser,
} from "../controller/user.js";
import { verifyJwt } from "../middlewares/jwtVerify.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/signUp").post(signUp);
router.route("/login").post(login);
router.route("/logout").get(verifyJwt, logOut);
router.route("/getUser/:userId").get(getCurrentUser);
router
  .route("/update/:userId")
  .post(verifyJwt, upload.single("avtar"), updateUser);

  

export default router;
