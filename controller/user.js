import ErrorHandler from "../utils/errorHandler.js";
import { User } from "../model/user.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { isValidObjectId } from "mongoose";

const signUp = async (req, res, next) => {
  const { email, name, password, address, phoneNo } = req.body;
  if (!email && !name && !password) {
    return next(new ErrorHandler("All fields required"));
  }
  const hashPassword = await bcrypt.hash(password, 10);

  try {
    const finduser = await User.findOne({ email });
    if (finduser) {
      return next(new ErrorHandler("User already Exit", 409));
    }

    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
      address: address ? address : null,
      phoneNO: phoneNo ? phoneNo : null,
    });
    return res.status(200).json({
      success: true,
      data: newUser,
      message: "User Register Successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, error.code));
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Both email password are required", 404));
  }

  try {
    const findUser = await User.findOne({ email });
    if (!findUser) {
      return next(new ErrorHandler("UserNot found", 404));
    }
    console.log("hash password", findUser.password);
    const comaprePassword = await bcrypt.compare(password, findUser.password);
    if (!comaprePassword) {
      return next(new ErrorHandler("Invalid password", 401));
    }

    const userData = {
      name: findUser.name,
      email: findUser.email,
      userId: findUser._id,
    };

    const token = Jwt.sign(userData, process.env.SECRET_KEY);

    const Option = {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 24 * 60 * 60 * 1000,
      sameSite: "none",
    };

    return res.status(200).cookie("token", token, Option).json({
      user: findUser,
      message: "user login successfully",
      success: true,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 403));
  }
};

const logOut = async (req, res, next) => {
  try {
    res
      .status(200)
      .clearCookie("token", {
        secure: true,
        sameSite: "none",
      })
      .json({
        success: true,
        message: "logOut Successfully",
      });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

const getCurrentUser = async (req, res, next) => {
  const { userId } = req.params;
  if (!isValidObjectId(userId)) {
    return next(new ErrorHandler("Invalid User Id", 400));
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorHandler("Not found User", 404));
    }

    res.status(200).json({
      success: true,
      message: "fech user",
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, error.code));
  }
};

const updateUser = async (req, res, next) => {
  const { userId } = req.params;
  const { name, email, password, phoneNO, address } = req.body;
  if (!isValidObjectId(userId)) {
    return next(new ErrorHandler("Invalid User Id", 400));
  }

  try {
    let uploadAvtar;
    let oldUser = await User.findById(userId);

    const update = {};
    if (name) {
      update.name = name;
    }
    if (email) {
      update.email = email;
    }
    if (phoneNO) {
      update.phoneNO = phoneNO;
    }
    if (address) {
      update.address = address;
    }
    if (password !== oldUser.password) {
      const hashPassword = await bcrypt.hash(password, 10);
      update.password = hashPassword;
    }

    if (req.file) {
      // delete old avtar from cloudinary
      const public_id = oldUser.avtar?.public_id;
      const result = await deleteFromCloudinary(public_id, "image");
      if (!result) {
        return next(new ErrorHandler("erorr deleting image", 500));
      }

      const avtarLocalPath = req.file?.path;
      uploadAvtar = await uploadOnCloudinary(avtarLocalPath);
      if (!uploadAvtar) {
        return next(new ErrorHandler("image upload failed", 500));
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: update,
        avtar: {
          Url: uploadAvtar?.url || oldUser.avtar.Url,
          secure_url: uploadAvtar?.public_id || oldUser.avtar.secure_url,
          public_id: uploadAvtar?.public_id || oldUser.avtar.public_id,
        },
      },
      {
        new: true,
      }
    );

    if (!user) {
      return next(new ErrorHandler(" User not found", 404));
    }

    return res.status(200).json({
      success: true,
      message: "update successfully",
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, error.code));
  }
};
export { signUp, login, logOut, getCurrentUser, updateUser };
