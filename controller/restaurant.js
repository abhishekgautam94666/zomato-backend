import ErrorHandler from "../utils/errorHandler.js";
import { Restaurant } from "../model/restaurant.js";
import { Menu } from "../model/menu.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { isValidObjectId } from "mongoose";

const createRestaurant = async (req, res, next) => {
  const {
    name,
    email,
    description,
    address,
    city,
    state,
    phone,
    cuisine_type,
    opening_hours,
    closing_hours,
  } = req.body;

  try {
    let allimage = [];

    if (!req.user) {
      return next(new ErrorHandler("plesae login", 402));
    }

    if (req.files) {
      const upload = await Promise.all(
        req.files?.map(async (image) => {
          const response = await uploadOnCloudinary(image.path);
          return response;
        })
      );

      allimage = upload.map((file) => ({
        url: file.url,
        secureUrl: file.secure_url,
        publicId: file.public_id,
      }));
    } else {
      return next(new ErrorHandler("please provide images", 400));
    }

    const createRestaurant = await Restaurant.create({
      userId: req.user._id,
      name,
      email,
      description,
      address,
      city,
      state,
      phone,
      cuisine_type,
      opening_hours,
      closing_hours,
      resImage: allimage,
    });
    if (!createRestaurant) {
      return next(new ErrorHandler("error adding restaurant", 400));
    }
    return res.status(200).json({
      success: true,
      message: "Restaurant added successfully",
      createRestaurant,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, error.code));
  }
};

const foodmenu = async (req, res, next) => {
  const { restoId } = req.params;
  console.log(restoId);
  const { name, price, category } = req.body;

  if (!restoId) {
    return next(
      new ErrorHandler("please login and create adding a restaurant", 404)
    );
  }

  try {
    const path = req.file?.path;
    const upload = await uploadOnCloudinary(path);
    if (!upload) {
      return next(new ErrorHandler("not uploaded image", 404));
    }

    const menu = await Menu.create({
      restaurantId: restoId,
      name,
      price,
      category,
      foodImg: {
        url: upload.url,
      },
    });

    if (!menu) {
      return next(new ErrorHandler("not added food item", 404));
    }

    return res.status(200).json({
      success: true,
      message: "item add successfully",
      data: menu,
    });
  } catch (error) {}
};

const getRestaurantmenu = async (req, res, next) => {
  const { restaurantId } = req.params;
  if (!isValidObjectId(restaurantId)) {
    return next(new ErrorHandler("not a valid restaurantId", 400));
  }
  if (!restaurantId) {
    return next(new ErrorHandler("not found restaurantId", 404));
  }
  try {
    const allMenu = await Menu.find();
    const menu = allMenu.filter((items) => items.restaurantId == restaurantId);

    if (!menu) {
      return next(new ErrorHandler("Not any menu", 400));
    }
    return res.status(200).json({
      success: true,
      message: "get menu successfully",
      menu,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, error.code));
  }
};

const myRestaurant = async (req, res, next) => {
  if (!req.user._id) {
    return next(new ErrorHandler("please Login", 401));
  }
  try {
    const restaurant = await Restaurant.find({ userId: req.user._id });
    if (!restaurant) {
      return next(new ErrorHandler("plesae Add Restaurant", 404));
    }
    return res.status(200).json({
      success: true,
      message: "restaurant found",
      restaurant,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, error.code));
  }
};

const allResto = async (req, res, next) => {
  try {
    const resto = await Restaurant.find();
    if (!resto) {
      return next(new ErrorHandler("no any restaurant", 404));
    }

    return res.status(200).json({
      success: true,
      message: "All restaurant are hear",
      resto,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, error.code));
  }
};

const currentResto = async (req, res, next) => {
  const { restoId } = req.params;
  if (!isValidObjectId(restoId)) {
    return next(new ErrorHandler("Invalid ID", 400));
  }

  try {
    const resto = await Restaurant.findById(restoId);
    if (!resto) {
      return next(new ErrorHandler("please create a restaurant", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Restaurant Found!",
      resto: [resto],
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, error.code));
  }
};

export {
  createRestaurant,
  foodmenu,
  getRestaurantmenu,
  myRestaurant,
  currentResto,
  allResto,
};
