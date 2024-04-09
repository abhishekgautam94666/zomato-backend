import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },

    phoneNO: {
      type: String,
    },
    avtar: {
      Url: {
        type: String,
      },
      secure_url: {
        type: String,
      },
      public_id: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
