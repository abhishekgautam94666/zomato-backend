import express from "express";
import {
  addToCart,
  deleteOrder,
  updateStatus,
  userOrder,
} from "../controller/order.js";
import { verifyJwt } from "../middlewares/jwtVerify.js";
import { paymentCheckOut } from "../controller/checkout.js";

const router = express.Router();

router.route("/addTo").post(addToCart);
router.route("/updateStatus/:id").post(updateStatus);
router.route("/delete/:id").delete(deleteOrder);
router.route("/userOrder/:userId").get(verifyJwt, userOrder);
router.route("/checkOut").post(paymentCheckOut);

export default router;
