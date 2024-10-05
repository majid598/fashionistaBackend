import fs from "fs";
import path from "path";
import { TryCatch } from "../Middlewares/errorMiddleware.js";
import { Product } from "../Models/Product.js";
import { User } from "../Models/User.js";
import ErrorHandler from "../Utils/utility.js";
import { v2 as cloudinary } from "cloudinary";
import { FlashSale } from "../Models/FlashSale.js";
import { start } from "repl";

const newProduct = TryCatch(async (req, res, next) => {
  console.log(req.body);
  const {
    name,
    brandName,
    regularPrice,
    salePrice,
    type,
    stockStatus,
    stockQuantity,
    unit,
    category,
    description,
    images,
  } = req.body;

  console.log(
    name,
    brandName,
    regularPrice,
    salePrice,
    type,
    stockStatus,
    stockQuantity,
    unit,
    category,
    description,
    images
  );

  if (
    !name ||
    !brandName ||
    !regularPrice ||
    !salePrice ||
    !type ||
    !stockStatus ||
    !stockQuantity ||
    !unit ||
    !category ||
    !description ||
    !images
  )
    return next(new ErrorHandler("All Fields Are required", 404));
  const product = await Product.create({
    seller: req.user,
    name,
    brandName,
    regularPrice,
    salePrice,
    type,
    stockStatus,
    stockQuantity,
    unit,
    category: category.toLowerCase(),
    description,
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
  const deletePromises = product.images.map((image) =>
    cloudinary.uploader.destroy(image.public_id)
  );
  await Promise.all(deletePromises);

  await product.deleteOne();

  return res.status(200).json({
    success: true,
    message: `${product.name} Product Deleted`,
  });
});
const addToWishlist = TryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  const user = await User.findById(req.user);

  if (!product) return next(new ErrorHandler("Product Not Found"));

  if (user.likedProducts.indexOf(product._id) === -1) {
    user.likedProducts.push(product._id);
  } else {
    user.likedProducts.splice(user.likedProducts.indexOf(product._id), 1);
  }

  await user.save();

  return res.status(200).json({
    success: true,
    message: `${product.name} ${user?.likedProducts?.includes(req.params.id)
      ? "Add To Wishlist"
      : "Removed From Wishlist"
      }`,
  });
});

const allProducts = TryCatch(async (req, res, next) => {
  const { category } = req.query;

  let products;
  if (category) {
    products = await Product.find({ category }).populate(
      "seller",
      "name profile"
    );
  } else {
    products = await Product.find().populate(
      "seller",
      "name profile"
    );
  }

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
const thisMonth = TryCatch(async (req, res, next) => {
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

  const products = await Product.aggregate([
    {
      $lookup: {
        from: 'orders',
        localField: '_id',
        foreignField: 'orderItems.product',
        as: 'orders',
      },
    },
    { $unwind: '$orders' },
    { $unwind: '$orders.orderItems' },
    {
      $match: {
        'orders.createdAt': { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    {
      $group: {
        _id: '$_id',
        name: { $first: '$name' },
        description: { $first: '$description' },
        images: { $first: '$images' },
        salePrice: { $first: '$salePrice' },
        regularPrice: { $first: '$regularPrice' },
        stockQuantity: { $first: '$stockQuantity' },
        stockStatus: { $first: '$stockStatus' },
        reviews: { $first: '$reviews' },
        numOfReviews: { $first: '$numOfReviews' },
        sold: { $sum: '$orders.orderItems.quantity' },
      },
    },
    { $sort: { sold: -1 } },
    { $limit: 10 },
  ]);

  return res.status(200).json({
    success: true,
    products,
  });
});

const upload = async (req, res, next) => {
  try {
    const image = req.file;
    console.log(image);
    // Delete the file from local uploads folder
    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload file" });
  }
};

const addToFlashSale = TryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product Not Found"));

  const sale = await FlashSale.findOne()
  if (sale) {
    sale.products.push(product._id);
    product.flashSale = true;
    await product.save();
    await sale.save();
    return res.status(200).json({
      success: true,
      message: `${product.name} Added To Flash Sale`,
    });
  }

  const newSale = await FlashSale.create({
    products: [product._id],
    startTime: new Date(),
    endTime: new Date(new Date().setDate(new Date().getDate() + 4)),
  });

  product.flashSale = true;
  await product.save();

  return res.status(200).json({
    success: true,
    message: `${product.name} Added To Flash Sale`,
  });
});
const flashSale = TryCatch(async (req, res, next) => {
  const products = await Product.find({ flashSale: true });
  const flashSale = await FlashSale.findOne();

  return res.status(200).json({
    success: true,
    flashSale,
    products,
  });
});

export {
  addToWishlist,
  allCategories,
  allProducts,
  deleteProduct,
  getSingleProduct,
  newProduct,
  updateProduct,
  upload,
  thisMonth,
  addToFlashSale,
  flashSale
};
