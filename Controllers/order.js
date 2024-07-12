import { TryCatch } from "../Middlewares/errorMiddleware.js";
import { Order } from "../Models/Order.js";
import { Product } from "../Models/Product.js";
import { User } from "../Models/User.js";
import { generateUniqueID } from "../Utils/features.js";
import ErrorHandler from "../Utils/utility.js";

const createOrder = TryCatch(async (req, res, next) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = req.body;

  if (!shippingAddress)
    return next(new ErrorHandler("Please Enter shippingInfo", 404));

  const uniqueID = await generateUniqueID();

  const order = await Order.create({
    orderId: uniqueID,
    user: req.user,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  });

  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (product) {
      product.sold += item.quantity;
      product.stockQuantity -= item.quantity;
      await product.save();
    }
  }

  const user = await User.findById(req.user);
  user.orders.push(order);
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Order Placed Successfully",
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
  const orders = await Order.find({}).populate('orderItems.product', 'name price category images').populate("user", "name").sort({ createdAt: -1 });

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

const stats = TryCatch(async (req, res, next) => {
  const processingOrder = await Order.find({ status: "processing" })
  const confirmedOrder = await Order.find({ status: "confirmed" })
  const shippedOrder = await Order.find({ status: "shipped" })
  const deliveredOrder = await Order.find({ status: "delivered" })
  const canceledOrder = await Order.find({ status: "canceled" })

  return res.status(200).json({
    success: true,
    processingOrder: processingOrder.length,
    confirmedOrder: confirmedOrder.length,
    shippedOrder: shippedOrder.length,
    deliveredOrder: deliveredOrder.length,
    canceledOrder: canceledOrder.length,
  })
})

export {
  allOrders,
  cancelOrder,
  createOrder,
  getAdminSingleOrder,
  getSingleOrder,
  myOrders,
  statusUpdate,
  cancelations,
  stats
};
