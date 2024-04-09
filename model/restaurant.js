import mongoose from "mongoose";

const restaurantScheema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: [true, "address is required"],
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    cuisine_type: {
      type: String,
    },
    opening_hours: String,
    closing_hours: String,
    resImage: [
      {
        url: String,
        secureUrl: String,
        publicId: String,
      },
    ],
  },
  { timestamps: true }
);

export const Restaurant = mongoose.model("Restaurant", restaurantScheema);
