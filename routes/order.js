import express from "express";
import {
  addToCart,
  deleteOrder,
  updateStatus,
  userOrder,
} from "../controller/order.js";

const router = express.Router();

router.route("/addTo").post(addToCart);
router.route("/updateStatus/:id").post(updateStatus);
router.route("/delete/:id").delete(deleteOrder);
router.route("/userOrder/:userId").get(userOrder);

export default router;
