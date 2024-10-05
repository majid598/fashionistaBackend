import express from "express";
import {
  addToWishlist,
  allCategories,
  allProducts,
  deleteProduct,
  getSingleProduct,
  newProduct,
  updateProduct,
  upload, thisMonth,
  addToFlashSale,
  flashSale
} from "../Controllers/Porduct.js";
import { isAuthenticated } from "../Middlewares/auth.js";
import { multiple, singleAvatar } from "../Middlewares/Multer.js";

const Router = express.Router();

Router.post("/new", isAuthenticated, newProduct);

Router.get("/all", allProducts);

Router.get("/explore/thismonth", thisMonth);

Router.get("/categories", allCategories);
Router.get("/add-to-wishlist/:id", isAuthenticated, addToWishlist);

Router.put("/update", updateProduct);

Router.post("/upload", singleAvatar, upload);

Router.get("/add-to-sale/:id", addToFlashSale);

Router.get("/products/flash-sale", flashSale);

Router.route("/:id").delete(deleteProduct).get(getSingleProduct);

export default Router;
