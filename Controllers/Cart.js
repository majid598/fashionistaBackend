import { TryCatch } from "../Middlewares/errorMiddleware.js";
import { Product } from "../Models/Product.js";
import { User } from "../Models/User.js";
import ErrorHandler from "../Utils/utility.js";


const addToCart = TryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  console.log(req.params.id)

  const user = await User.findById(req.user);

  if (!product) return next(new ErrorHandler("Product Not Found", 400));

  const productInCart = user.cartItems.find(cartItem => cartItem.product.toString() === req.params.id);

  if (productInCart) {
    return res.status(400).json({ message: 'Product already in cart' });
  } else if (product.stockQuantity <= 0) { return next(new ErrorHandler("Out Of Stock", 400)); } else {
    user.cartItems.push({ product: product._id, price: product.salePrice });
    await user.save();
  }

  return res.status(200).json({
    success: true,
    message: `${product.name} Added To Cart`,
  });
});

const cart = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.user).populate("cartItems.product", "name images salePrice stockQuantity");

  return res.status(200).json({
    success: true,
    cartItems: user.cartItems,
  });
});
const increase = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.user).populate("cartItems.product", "stockQuantity")

  const cartItem = user.cartItems.find(cartItem => cartItem.product?._id.toString() === req.params.id);
  if (!cartItem) {
    return next(new ErrorHandler('Product not found in cart'));
  }

  if (cartItem.quantity >= cartItem.product.stockQuantity) return

  cartItem.quantity += 1;
  await user.save();

  return res.status(200).json({
    success: true,
  });
});
const decrease = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.user)

  const cartItem = user.cartItems.find(cartItem => cartItem.product.toString() === req.params.id);
  if (!cartItem) {
    return next(new ErrorHandler('Product not found in cart'))
  }

  if (cartItem.quantity <= 1) return

  cartItem.quantity -= 1;
  await user.save();

  return res.status(200).json({
    success: true,
  });
});

export { addToCart, cart, increase, decrease };