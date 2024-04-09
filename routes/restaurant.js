import express from "express";
import {
  allResto,
  createRestaurant,
  currentResto,
  foodmenu,
  getRestaurantmenu,
  myRestaurant,
} from "../controller/restaurant.js";
import { verifyJwt } from "../middlewares/jwtVerify.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();
router
  .route("/addRes")
  .post(verifyJwt, upload.array("resImage"), createRestaurant);

router
  .route("/menu/:restoId")
  .post(verifyJwt, upload.single("foodImg"), foodmenu);

router.route("/getMenuItem/:restaurantId").get(getRestaurantmenu);

router.route("/myResto").get(verifyJwt, myRestaurant);
router.route("/currentResto/:restoId").get(currentResto);
router.route("/allResto").get(allResto);
export default router;
