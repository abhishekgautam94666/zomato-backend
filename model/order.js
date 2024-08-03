import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  price: Number,
  url: String,
});

const orderSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    userAddress: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: orderItemSchema,
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled", "Complete"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
