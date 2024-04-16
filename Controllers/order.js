import { TryCatch } from "../Middlewares/errorMiddleware.js";
import { Order } from "../Models/Order.js";
import { Product } from "../Models/Product.js";
import { User } from "../Models/User.js";
import ErrorHandler from "../Utils/utility.js";

const createOrder = TryCatch(async (req, res, next) => {
  const { userId, totalAmount, shippingInfo, orderItems } = req.body;

  if (!shippingInfo)
    return next(new ErrorHandler("Please Enter shippingInfo", 404));

  const order = await Order.create({
    user: userId,
    totalAmount,
    orderItems,
    shippingInfo,
  });

  const user = await User.findById(userId);
  user.orders.push(order);
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Order Placed Successfuly",
  });
});

const cancelOrder = TryCatch(async (req, res, next) => {
  const orderId = req.params.id;
  const order = await Order.findById(orderId);

  if (order.status === "Canceled")
    return next(new ErrorHandler("Order Already Canceled"));

  order.status = "Canceled";

  await order.save();

  return res.status(200).json({
    success: true,
    message: "Order Canceled",
  });
});

const allOrders = TryCatch(async (req, res, next) => {
  const orders = await Order.find({});

  return res.status(200).json({
    success: true,
    orders,
  });
});

const cancelations = TryCatch(async (req, res, next) => {
  const { id: user } = req.query;
  const orders = await Order.find({ status: "Canceled", user });

  return res.status(200).json({
    success: true,
    orders,
  });
});

const myOrders = TryCatch(async (req, res, next) => {
  const { id: user } = req.query;
  const orders = await Order.find({ user: user });

  return res.status(200).json({
    success: true,
    orders,
  });
});

const getSingleOrder = TryCatch(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  return res.status(200).json({
    success: true,
    order,
  });
});

const getAdminSingleOrder = TryCatch(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  const user = await User.findById(order.user);

  return res.status(200).json({
    success: true,
    order,
    user,
  });
});

const statusUpdate = TryCatch(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (order.status === "Canceled")
    return next(new ErrorHandler("Order Canceled"));

  switch (order.status) {
    case "Processing":
      order.status = "Shipped";
      break;
    case "Shipped":
      order.status = "Delivered";
      break;
    default:
      order.status = "Delivered";
      break;
  }

  await order.save();

  return res.status(200).json({
    success: true,
    message: "Order Status Updated",
  });
});

export {
  allOrders,
  cancelOrder,
  createOrder,
  getAdminSingleOrder,
  getSingleOrder,
  myOrders,
  statusUpdate,
  cancelations,
};
