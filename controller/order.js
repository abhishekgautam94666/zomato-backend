import ErrorHandler from "../utils/errorHandler.js";
import { Order } from "../model/order.js";
import { isValidObjectId } from "mongoose";

const addToCart = async (req, res, next) => {
  const { userId, status, items, restaurantId } = req.body;
  if (!isValidObjectId(restaurantId)) {
    return next(new ErrorHandler("Invalid restaurant Id", 400));
  }

  if (!isValidObjectId(userId)) {
    return next(new ErrorHandler("Invalid restaurant Id", 400));
  }

  try {
    const createOrder = await Order.create({
      restaurantId,
      userId,
      items,
      status,
    });
    if (!createOrder) {
      return next(new ErrorHandler(" Failed to make an Order", 500));
    }
    return res.status(200).json({
      success: true,
      message: "Order created successfully. Please proceed to payment.",
      order: createOrder,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, error.code));
  }
};

const updateStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status, quantity } = req.body;
  //checking the id validity
  if (!isValidObjectId(id)) {
    return next(new ErrorHandler("Invalid ID", 400));
  }

  try {
    const update = {};
    if (status) {
      update.status = status;
    }
    if (quantity) {
      update.quantity = quantity;
    }
    let order1 = await Order.findById(id);

    let order = await Order.findByIdAndUpdate(
      id,
      {
        status: status,
        items: {
          name: order1.items.name,
          price: order1.items.price,
          quantity: quantity ? quantity : order1.items.quantity,
          Url: order1.items.Url,
        },
      },
      { new: true }
    );
    if (!order) {
      return next(new ErrorHandler("error update status", 400));
    }
    return res.status(200).json({
      success: true,
      message: "update success",
      order,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, error.code));
  }
};

const deleteOrder = async (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(new ErrorHandler("Invalid ID", 400));
  }

  try {
    const del = await Order.findByIdAndDelete(id);
    if (!del) {
      return next(new ErrorHandler("Failed to Delete", 500));
    }
    return res.status(201).json({
      success: true,
      message: "remove success",
      del,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, error.code));
  }
};

const userOrder = async (req, res, next) => {
  const { userId } = req.params;
  if (!isValidObjectId(userId)) {
    return next(new ErrorHandler("Invalid user Id"), 400);
  }

  try {
    const orders = await Order.find({ userId: userId });
    if (orders.length < 1) {
      return next(new ErrorHandler("cart is empty", 404));
    }
    return res.status(200).json({
      success: true,
      message: "show all cart",
      orders,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, error.code));
  }
};
export { addToCart, updateStatus, deleteOrder, userOrder };
