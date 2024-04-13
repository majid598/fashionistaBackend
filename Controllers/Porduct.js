import { TryCatch } from "../Middlewares/errorMiddleware.js";
import ErrorHandler from "../Utils/utility.js";
import { Product } from "../Models/Product.js";
import { Notification } from "../Models/Notification.js";

const newProduct = TryCatch(async (req, res, next) => {
  const { name, description, price, category, stock } = req.body;

  console.log(name, description, price, category, stock);

  const images = req.files.map((file) => file.path);

  if (!images) return next(new ErrorHandler("Please Add Atleast 1 Photo"));

  console.log(name, description, price, category, stock);

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

const updateProduct = TryCatch(async (req, res, next) => {});

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

export { newProduct, allProducts, deleteProduct, getSingleProduct };
