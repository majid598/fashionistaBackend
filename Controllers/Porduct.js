import { TryCatch } from "../Middlewares/errorMiddleware.js";
import ErrorHandler from "../Utils/utility.js";
import { Product } from "../Models/Product.js";
import { Notification } from "../Models/Notification.js";

const newProduct = TryCatch(async (req, res, next) => {
  const { name, description, price, category, stock, images } = req.body;

  if (!name || !description || !price || !category || !stock)
    return next(new ErrorHandler("All Fields Are required", 404));
  const product = await Product.create({
    name,
    description,
    price,
    category: category.toLowerCase(),
    stock,
    images,
  });

  return res.status(201).json({
    success: true,
    message: "Product Created Successfully",
  });
});

const getSingleProduct = TryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!Product) return next(new ErrorHandler("Procut Expire", 404));

  return res.status(200).json({
    success: true,
    product: product,
  });
});

const updateProduct = TryCatch(async (req, res, next) => {
  const { productId, name, price, stock, category, description } = req.body;
  console.log(productId, name, price, stock, category, description);

  const product = await Product.findById(productId);

  if (!product) return next(new ErrorHandler("Product Not Found"));

  product.name = name ? name : product.name;
  product.price = price ? price : product.price;
  product.stock = stock ? stock : product.stock;
  product.category = category ? category : product.category;
  product.description = description ? description : product.description;

  await product.save();

  return res.status(200).json({
    success: true,
    message: "Product Updated Successfuly",
  });
});

const deleteProduct = TryCatch(async (req, res, next) => {
  const id = req.params.id;

  const product = await Product.findById(id);

  if (!product) return next(new ErrorHandler("Product Not Found"));

  await product.deleteOne();

  return res.status(200).json({
    success: true,
    message: `${product.name} Product Deleted`,
  });
});

const allProducts = TryCatch(async (req, res, next) => {
  const products = await Product.find({});
  return res.status(200).json({
    success: true,
    products,
  });
});

const allCategories = TryCatch(async (req, res, next) => {
  const categories = await Product.distinct("category");

  return res.status(200).json({
    success: true,
    categories,
  });
});

export {
  newProduct,
  allProducts,
  deleteProduct,
  getSingleProduct,
  allCategories,
  updateProduct,
};
