import { User } from "../model/user.js";
import ErrorHandler from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";

export const verifyJwt = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) return next(new ErrorHandler("Unothrized request", 404));

    const decodeToken = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decodeToken?.userId).select("-password");
    if (!user) {
      return next(new ErrorHandler("Invalid access token", 401));
    }
    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};
